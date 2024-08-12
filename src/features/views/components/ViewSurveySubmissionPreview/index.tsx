import { AssignmentTurnedInOutlined } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Button,
  Paper,
  Popper,
  PopperProps,
  Typography,
} from '@mui/material';
import { FC, ReactNode, useMemo } from 'react';

import { Msg } from 'core/i18n';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import messageIds from 'features/views/l10n/messageIds';

interface PreviewableSubmissionData {
  id: number;
  matchingContent: ReactNode | null;
  submitted: string;
}

interface ViewSurveySubmissionPreviewProps {
  anchorEl?: PopperProps['anchorEl'];
  onOpenSubmission?: (id: number) => void;
  submissions: PreviewableSubmissionData[];
}

const useStyles = makeStyles(() => ({
  container: {
    width: 300,
  },
  header: {
    fontSize: '1.1em',
  },
  timestamp: {
    color: 'grey',
  },
}));

const ViewSurveySubmissionPreview: FC<ViewSurveySubmissionPreviewProps> = ({
  anchorEl,
  onOpenSubmission,
  submissions,
}) => {
  const styles = useStyles();
  const sorted = useMemo(
    () =>
      submissions.sort((sub0, sub1) => {
        const d0 = new Date(sub0.submitted);
        const d1 = new Date(sub1.submitted);
        return d1.getTime() - d0.getTime();
      }),
    [submissions]
  );
  const [isRestricted] = useAccessLevel();

  const [mostRecent, ...older] = sorted;

  return (
    <Popper
      anchorEl={anchorEl}
      className={styles.container}
      open={!!anchorEl}
      popperOptions={{
        placement: 'left',
      }}
    >
      <Paper elevation={2}>
        <Box p={2}>
          <Box>
            {mostRecent && (
              <Box>
                <Typography className={styles.header} variant="h5">
                  <Msg id={messageIds.surveyPreview.mostRecent.header} />
                </Typography>
                <Typography
                  className={styles.timestamp}
                  marginBottom={1}
                  marginTop={1}
                >
                  <ZUIRelativeTime datetime={mostRecent.submitted} forcePast />
                </Typography>
                <Box marginBottom={1}>{mostRecent.matchingContent}</Box>
                {!isRestricted && (
                  <Button
                    onClick={() =>
                      onOpenSubmission && onOpenSubmission(mostRecent.id)
                    }
                    startIcon={<AssignmentTurnedInOutlined />}
                  >
                    <Msg id={messageIds.surveyPreview.mostRecent.openButton} />
                  </Button>
                )}
              </Box>
            )}
          </Box>
          {!!older.length && (
            <Box marginTop={2}>
              <Typography className={styles.header} variant="h5">
                <Msg id={messageIds.surveyPreview.older.header} />
              </Typography>
              {older.map((submission) => {
                return (
                  <Box key={submission.id} marginBottom={1}>
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Typography className={styles.timestamp}>
                        <ZUIRelativeTime
                          datetime={submission.submitted}
                          forcePast
                        />
                      </Typography>
                      {!isRestricted && (
                        <Button
                          onClick={() =>
                            onOpenSubmission && onOpenSubmission(submission.id)
                          }
                          startIcon={<AssignmentTurnedInOutlined />}
                        >
                          <Msg id={messageIds.surveyPreview.older.openButton} />
                        </Button>
                      )}
                    </Box>
                    <Box>{submission.matchingContent}</Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Paper>
    </Popper>
  );
};

export default ViewSurveySubmissionPreview;
