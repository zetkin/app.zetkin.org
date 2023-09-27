import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Add, Edit } from '@mui/icons-material';
import { Box, Button, Card, Divider, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import useCallAssignment from '../hooks/useCallAssignment';
import useCallAssignmentStats from '../hooks/useCallAssignmentStats';
import { useNumericRouteParams } from 'core/hooks';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

const useStyles = makeStyles((theme) => ({
  chip: {
    backgroundColor: theme.palette.statusColors.gray,
    borderRadius: '1em',
    color: theme.palette.text.secondary,
    display: 'flex',
    fontSize: '1.8em',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
}));

const CallAssignmentTargets = () => {
  const classes = useStyles();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  const { orgId, callAssId } = useNumericRouteParams();
  const { isTargeted, setTargets, target } = useCallAssignment(
    orgId,
    callAssId
  );
  const { data: statsData } = useCallAssignmentStats(orgId, callAssId);

  return (
    <>
      <Card>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography variant="h4">
            <Msg id={messageIds.targets.title} />
          </Typography>
          {isTargeted && (
            <ZUIAnimatedNumber value={statsData?.allTargets || 0}>
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
          query={target}
        />
      )}
    </>
  );
};

export default CallAssignmentTargets;
