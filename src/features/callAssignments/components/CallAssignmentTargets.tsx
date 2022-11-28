import { FormattedMessage as Msg } from 'react-intl';
import { useState } from 'react';
import { Add, Edit } from '@material-ui/icons';
import {
  Box,
  Button,
  Card,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';

import CallAssignmentModel from '../models/CallAssignmentModel';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

const useStyles = makeStyles((theme) => ({
  button: {
    borderColor: theme.palette.targetingStatusBar.blue,
    color: theme.palette.targetingStatusBar.blue,
  },
  chip: {
    backgroundColor: theme.palette.targetingStatusBar.gray,
    borderRadius: '1em',
    color: 'secondary',
    display: 'flex',
    fontSize: '1.8em',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
}));

const CallAssignmentTargets = ({ model }: { model: CallAssignmentModel }) => {
  const classes = useStyles();

  const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  const stats = model.getStats();
  const { target } = model.getData();

  return (
    <>
      <Card>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography variant="h4">
            <Msg id="pages.organizeCallAssignment.targets.title" />
          </Typography>
          {model.isTargeted && (
            <ZUIAnimatedNumber value={stats?.allTargets || 0}>
              {(animatedValue) => (
                <Box className={classes.chip}>{animatedValue}</Box>
              )}
            </ZUIAnimatedNumber>
          )}
        </Box>
        {model.isTargeted ? (
          <>
            <Divider />
            <Box p={2}>
              <Button
                className={classes.button}
                onClick={() => setQueryDialogOpen(true)}
                startIcon={<Edit />}
                variant="outlined"
              >
                <Msg id="pages.organizeCallAssignment.targets.editButton" />
              </Button>
            </Box>
          </>
        ) : (
          <Box pb={2} px={2}>
            <Box bgcolor="background.secondary" p={2}>
              <Typography>
                <Msg id="pages.organizeCallAssignment.targets.subtitle" />
              </Typography>
              <Box pt={1}>
                <Button
                  className={classes.button}
                  onClick={() => setQueryDialogOpen(true)}
                  startIcon={<Add />}
                  variant="outlined"
                >
                  <Msg id="pages.organizeCallAssignment.targets.defineButton" />
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
            model.setTargets(query);
            setQueryDialogOpen(false);
          }}
          query={target}
        />
      )}
    </>
  );
};

export default CallAssignmentTargets;
