import { makeStyles } from '@mui/styles';
import { Add, Edit } from '@mui/icons-material';
import { Box, Button, Card, Divider, Typography } from '@mui/material';
import { FC, useState } from 'react';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import useVisitAssignment from '../hooks/useVisitAssignment';
import useVisitAssignmentStats from '../hooks/useVisitAssignmentStats';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import oldTheme from 'theme';

const useStyles = makeStyles(() => ({
  chip: {
    backgroundColor: oldTheme.palette.statusColors.grey,
    borderRadius: '1em',
    color: oldTheme.palette.text.secondary,
    display: 'flex',
    fontSize: '1.8em',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
}));

interface VisitAssignmentTargetsProps {
  assignmentId: number;
  orgId: number;
}

const VisitAssignmentTargets: FC<VisitAssignmentTargetsProps> = ({
  orgId,
  assignmentId,
}) => {
  const classes = useStyles();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  const {
    data: visitAssignment,
    isTargeted,
    updateTargets: setTargets,
  } = useVisitAssignment(orgId, assignmentId);
  const statsFuture = useVisitAssignmentStats(orgId, assignmentId);

  return (
    <>
      <Card>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography variant="h4">
            <Msg id={messageIds.targets.title} />
          </Typography>
          {isTargeted && (
            <ZUIAnimatedNumber value={statsFuture.data?.allTargets || 0}>
              {(animatedValue) => (
                <Box className={classes.chip}>{animatedValue}</Box>
              )}
            </ZUIAnimatedNumber>
          )}
        </Box>
        {isTargeted ? (
          <>
            <Divider />
            <Box p={2}>
              <Button
                onClick={() => setQueryDialogOpen(true)}
                startIcon={<Edit />}
                variant="outlined"
              >
                <Msg id={messageIds.targets.editButton} />
              </Button>
            </Box>
          </>
        ) : (
          <Box pb={2} px={2}>
            <Box bgcolor="background.secondary" p={2}>
              <Typography>
                <Msg id={messageIds.targets.subtitle} />
              </Typography>
              <Box pt={1}>
                <Button
                  onClick={() => setQueryDialogOpen(true)}
                  startIcon={<Add />}
                  variant="outlined"
                >
                  <Msg id={messageIds.targets.defineButton} />
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Card>
      {queryDialogOpen && (
        <SmartSearchDialog
          onDialogClose={() => setQueryDialogOpen(false)}
          onSave={(query) => {
            setTargets(query);
            setQueryDialogOpen(false);
          }}
          query={visitAssignment?.target}
        />
      )}
    </>
  );
};

export default VisitAssignmentTargets;
