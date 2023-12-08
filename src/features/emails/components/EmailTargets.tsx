import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Add, Edit, Lock, Visibility } from '@mui/icons-material';
import { Box, Button, Card, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
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

const EmailTargets = () => {
  const classes = useStyles();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  // const {data:email, isTargeted,updateTargets:setTargets, isLocked}= useEmail(orgId,emailId)
  // const {statsFuture } = useEmailStats(orgId,emailId)
  const isTargeted = false;
  const isLocked = false;
  const statsFuture = { data: { allTargets: undefined } };

  return (
    <>
      <Card>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography variant="h4">
            <Msg id={messageIds.targets.title} />
          </Typography>
          <ZUIAnimatedNumber value={statsFuture.data?.allTargets || 0}>
            {(animatedValue) => (
              <Box className={classes.chip}>{animatedValue}</Box>
            )}
          </ZUIAnimatedNumber>
        </Box>
        <Box pb={2} px={2}>
          <Box bgcolor="background.secondary" p={2}>
            <Typography>
              <Msg id={messageIds.targets.subtitle} />
            </Typography>
            <Box pt={1}>
              {isTargeted ? (
                <Box>
                  <Button
                    startIcon={isLocked ? <Visibility /> : <Edit />}
                    variant="outlined"
                  >
                    <Msg
                      id={
                        isLocked
                          ? messageIds.targets.viewButton
                          : messageIds.targets.editButton
                      }
                    />
                  </Button>
                  {isLocked && (
                    <Button
                      startIcon={<Lock />}
                      sx={{ ml: 2 }}
                      variant="outlined"
                    >
                      <Msg id={messageIds.targets.unlock} />
                    </Button>
                  )}
                </Box>
              ) : (
                <Button
                  onClick={() => setQueryDialogOpen(true)}
                  startIcon={<Add />}
                  variant="outlined"
                >
                  <Msg id={messageIds.targets.defineButton} />
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Card>
      {queryDialogOpen && (
        <SmartSearchDialog
          onDialogClose={() => setQueryDialogOpen(false)}
          onSave={(query) => {
            // setTargets(query);
            setQueryDialogOpen(false);
          }}
          query={null}
        />
      )}
    </>
  );
};

export default EmailTargets;
