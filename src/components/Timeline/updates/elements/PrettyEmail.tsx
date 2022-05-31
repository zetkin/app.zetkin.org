import { FormattedMessage } from 'react-intl';
import Link from 'next/link';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { LetterparserNode, parse } from 'letterparser';
import { useCallback, useEffect, useState } from 'react';

import CleanHtml from 'components/CleanHtml';

interface PrettyEmailProps {
  emailStr: string;
}

const COLLAPSED_SIZE = 100;

const PrettyEmail: React.FC<PrettyEmailProps> = ({ emailStr }) => {
  const [emailData, setEmailData] = useState<LetterparserNode | null>(null);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const [didMeasure, setDidMeasure] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const divCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const height = node.clientHeight;
        if (height > COLLAPSED_SIZE && !needsCollapse) {
          setNeedsCollapse(true);
        }
        setDidMeasure(true);
      }
    },
    [setNeedsCollapse]
  );

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
        <Collapse
          collapsedSize={COLLAPSED_SIZE}
          in={(didMeasure && !needsCollapse) || !collapsed}
        >
          <div ref={divCallback}>
            <EmailBody body={emailData.body} />
          </div>
        </Collapse>
        {needsCollapse && (
          <Button
            color="primary"
            onClick={() => setCollapsed(!collapsed)}
            startIcon={collapsed ? <ExpandMore /> : <ExpandLess />}
            style={{ textTransform: 'uppercase' }}
          >
            <FormattedMessage
              id={collapsed ? 'misc.email.expand' : 'misc.email.collapse'}
            />
          </Button>
        )}
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
      <div className={classes.body}>
        <CleanHtml dirtyHtml={content} />
      </div>
    );
  }
};

const EmailHeader: React.FC<{ headers: LetterparserNode['headers'] }> = ({
  headers,
}) => {
  const RELEVANT_HEADERS = ['from', 'to', 'cc'];
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
                  <FormattedMessage id={`misc.email.headers.${headerName}`} />
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
