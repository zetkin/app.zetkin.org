import Link from 'next/link';
import makeStyles from '@mui/styles/makeStyles';
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  Theme,
  Typography,
} from '@mui/material';
import { LetterparserNode, parse } from 'letterparser';
import { useEffect, useState } from 'react';

import { Msg } from 'core/i18n';
import ZUICleanHtml from 'zui/ZUICleanHtml';
import ZUICollapse from 'zui/ZUICollapse';

import messageIds from 'zui/ZUITimeline/l10n/messageIds';

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
        <Typography
          style={{ fontWeight: 'bold', marginBottom: 8, marginTop: 8 }}
        >
          {emailData.headers.Subject}
        </Typography>
        <ZUICollapse collapsedSize={100}>
          <EmailBody body={emailData.body} />
        </ZUICollapse>
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

    return (
      <ZUICleanHtml
        BoxProps={{
          className: classes.body,
          component: 'div',
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        }}
        dirtyHtml={content}
      />
    );
  }
};

const EmailHeader: React.FC<{ headers: LetterparserNode['headers'] }> = ({
  headers,
}) => {
  const RELEVANT_HEADERS = ['from', 'to', 'cc'] as const;

  return (
    <Grid container direction="column" spacing={1}>
      {RELEVANT_HEADERS.map((headerName) => {
        const matchedHeader = Object.entries(headers).find(
          ([key]) => key.toLowerCase() == headerName.toLowerCase()
        );

        if (matchedHeader && matchedHeader[1]) {
          const values = matchedHeader[1].split(',');

          return (
            <Grid key={headerName} container direction="row" item wrap="nowrap">
              <Grid item style={{ marginRight: 12, marginTop: '0.2em' }}>
                <Typography>
                  <Msg id={messageIds.email.headers[headerName]} />
                </Typography>
              </Grid>
              <Grid item>
                {values.map((value) => (
                  <Link key={value} href={`mailto:${value}`} passHref>
                    <Chip
                      component="a"
                      label={value}
                      style={{ marginBottom: 4, marginRight: 4 }}
                    />
                  </Link>
                ))}
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
