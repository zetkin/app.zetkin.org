import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { Box, Button, Link, Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';

interface ShareViewDialogDownloadTabProps {
  onAbort?: () => void;
}

const useStyles = makeStyles({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
  },
  link: {
    cursor: 'pointer',
  },
  warning: {
    maxWidth: 400,
    textAlign: 'center',
  },
});

const ShareViewDialogDownloadTab: FC<ShareViewDialogDownloadTabProps> = ({
  onAbort,
}) => {
  const styles = useStyles();
  const { orgId, viewId } = useRouter().query;

  return (
    <Box className={styles.container}>
      <Box className={styles.warning}>
        <Typography marginBottom={1} variant="body1">
          <Msg id={messageIds.shareDialog.download.warning1} />
        </Typography>
        <Typography marginBottom={1} variant="body1">
          <Msg
            id={messageIds.shareDialog.download.warning2}
            values={{
              shareLink: (
                <Link
                  className={styles.link}
                  onClick={() => {
                    if (onAbort) {
                      onAbort();
                    }
                  }}
                >
                  <Msg id={messageIds.shareDialog.download.shareLink} />
                </Link>
              ),
            }}
          />
        </Typography>
        <Box display="flex" gap={1} justifyContent="center" marginTop={3}>
          <Button
            component="a"
            href={`/api/views/download?orgId=${orgId}&viewId=${viewId}&format=csv`}
            variant="outlined"
          >
            <Msg id={messageIds.shareDialog.download.buttons.csv} />
          </Button>
          <Button
            component="a"
            href={`/api/views/download?orgId=${orgId}&viewId=${viewId}&format=xlsx`}
            variant="outlined"
          >
            <Msg id={messageIds.shareDialog.download.buttons.xlsx} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShareViewDialogDownloadTab;
