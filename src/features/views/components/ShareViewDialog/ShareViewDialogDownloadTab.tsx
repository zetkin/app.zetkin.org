import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import { Box, Button, Link, Typography } from '@mui/material';

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

  return (
    <Box className={styles.container}>
      <Box className={styles.warning}>
        <Typography marginBottom={1} variant="body1">
          <FormattedMessage id="pages.people.views.shareDialog.download.warning1" />
        </Typography>
        <Typography marginBottom={1} variant="body1">
          <FormattedMessage
            id="pages.people.views.shareDialog.download.warning2"
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
                  <FormattedMessage id="pages.people.views.shareDialog.download.shareLink" />
                </Link>
              ),
            }}
          />
        </Typography>
        <Box display="flex" gap={1} justifyContent="center" marginTop={3}>
          <Button variant="outlined">Download CSV file</Button>
          <Button variant="outlined">Download Excel file</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShareViewDialogDownloadTab;
