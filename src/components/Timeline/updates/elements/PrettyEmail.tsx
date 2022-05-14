import { FormattedMessage } from 'react-intl';
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { LetterparserNode, parse } from 'letterparser';
import { useEffect, useState } from 'react';

interface PrettyEmailProps {
  emailStr: string;
}

const PrettyEmail: React.FC<PrettyEmailProps> = ({ emailStr }) => {
  const [emailData, setEmailData] = useState<LetterparserNode | null>(null);

  useEffect(() => {
    async function parseEmailStr() {
      const data = await parse(emailStr);
      setEmailData(data);
    }

    parseEmailStr();
  }, [emailStr]);

  if (emailData) {
    return (
      <Box>
        <EmailHeader headers={emailData.headers} />
        <Typography style={{ fontWeight: 'bold', marginBottom: 8 }}>
          {emailData.headers.Subject}
        </Typography>
        <EmailBody body={emailData.body} />
      </Box>
    );
  } else {
    return <CircularProgress />;
  }
};

const useBodyStyles = makeStyles<Theme, { plain: boolean }>((theme) => ({
  body: {
    '& blockquote': {
      borderColor: theme.palette.text.disabled,
      borderLeftWidth: 4,
      borderStyle: 'solid',
      borderWidth: 0,
      marginLeft: 2,
      opacity: 0.8,
      paddingLeft: 10,
    },
    fontFamily: 'sans-serif',
    whiteSpace: ({ plain }) => (plain ? 'pre' : 'normal'),
  },
}));

const EmailBody: React.FC<{
  body: LetterparserNode['body'];
  forcePlain?: boolean;
}> = ({ body, forcePlain = false }) => {
  const plain = forcePlain || typeof body == 'string';
  const classes = useBodyStyles({ plain });

  if (Array.isArray(body)) {
    let bodyToRender = body.find(
      (bodyCandidate) => bodyCandidate.contentType.type === 'text/html'
    );

    if (!bodyToRender) {
      bodyToRender = body[0];
    }

    return <EmailBody body={bodyToRender.body} forcePlain />;
  } else {
    const content = typeof body == 'string' ? body : body.toString();

    // TODO: Sanitize content before rendering
    return (
      <div
        className={classes.body}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
};

const EmailHeader: React.FC<{ headers: LetterparserNode['headers'] }> = ({
  headers,
}) => {
  const RELEVANT_HEADERS = ['from', 'to', 'cc'];
  return (
    <Grid container direction="column">
      {RELEVANT_HEADERS.map((headerName) => {
        const matchedHeader = Object.entries(headers).find(
          ([key]) => key.toLowerCase() == headerName.toLowerCase()
        );

        if (matchedHeader && matchedHeader[1]) {
          const values = matchedHeader[1].split(',');

          return (
            <Grid key={headerName} item style={{ marginBottom: 8 }}>
              <Grid container direction="row" wrap="nowrap">
                <Grid item style={{ paddingRight: 12, paddingTop: '0.2em' }}>
                  <Typography>
                    <FormattedMessage id={`misc.email.headers.${headerName}`} />
                  </Typography>
                </Grid>
                <Grid item>
                  {values.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      style={{ marginBottom: 4, marginRight: 4 }}
                    />
                  ))}
                </Grid>
              </Grid>
            </Grid>
          );
        } else {
          return null;
        }
      })}
    </Grid>
  );
};

export default PrettyEmail;
