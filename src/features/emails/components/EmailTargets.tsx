import { makeStyles } from '@mui/styles';
import { Add, Edit, Lock, LockOpen, Visibility } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import { ZetkinEmail, ZetkinQuery } from 'utils/types/zetkin';

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

interface EmailTargetsProps {
  email: ZetkinEmail;
  isTargeted: boolean;
  isLoading: boolean;
  isLocked: boolean;
  onToggleLocked: () => void;
  readyTargets: number;
  state: EmailState;
  targets: number;
  updateTargets: (filter_spec: Pick<ZetkinQuery, 'filter_spec'>) => void;
}

const EmailTargets: FC<EmailTargetsProps> = ({
  email,
  isTargeted,
  isLoading,
  isLocked,
  onToggleLocked,
  readyTargets,
  state,
  targets,
  updateTargets,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  //not locked, not targeted
  const notTargeted = !isTargeted && !isLocked;

  //targeted, not locked
  const targetedNotLocked = isTargeted && !isLocked;

  //locked, targeted, with or without publish date
  const targetedAndLocked = isTargeted && isLocked && state !== EmailState.SENT;

  //locked, targeted, published and published is in the past
  const sent = isTargeted && isLocked && state === EmailState.SENT;

  const getSubtitleMessageId = () => {
    if (notTargeted) {
      return messageIds.targets.subtitle.notTargeted;
    } else if (targetedNotLocked) {
      return messageIds.targets.subtitle.targetedNotLocked;
    } else if (targetedAndLocked) {
      if (state == EmailState.SCHEDULED) {
        return messageIds.targets.subtitle.scheduled;
      } else {
        return messageIds.targets.subtitle.targetedAndLocked;
      }
    } else {
      //Must be "sent"
      return messageIds.targets.subtitle.sent;
    }
  };

  return (
    <>
      <Card>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography variant="h4">
            <Msg id={messageIds.targets.title} />
          </Typography>
          <Box alignItems="center" display="flex" gap={2}>
            {isLocked && (
              <Box
                bgcolor={theme.palette.grey[300]}
                borderRadius="2em"
                padding={1}
              >
                <Typography variant="body2">
                  <Msg id={messageIds.targets.lockedChip} />
                </Typography>
              </Box>
            )}
            <ZUIAnimatedNumber value={targets}>
              {(animatedValue) => (
                <Box className={classes.chip}>{animatedValue}</Box>
              )}
            </ZUIAnimatedNumber>
          </Box>
        </Box>
        <Divider />
        <Box pb={2}>
          <Box
            alignItems="flex-start"
            display="flex"
            flexDirection="column"
            gap={1}
            p={2}
          >
            <Typography>
              <Msg id={getSubtitleMessageId()} />
            </Typography>
            {targetedAndLocked && state != EmailState.SCHEDULED && (
              <Alert severity="info">
                <Msg id={messageIds.targets.unlockAlert} />
              </Alert>
            )}
            <Box alignItems="center" display="flex" gap={1} pt={1}>
              {notTargeted && (
                <Button
                  onClick={() => setQueryDialogOpen(true)}
                  startIcon={<Add />}
                  variant="outlined"
                >
                  <Msg id={messageIds.targets.defineButton} />
                </Button>
              )}
              {targetedNotLocked && (
                <Box alignItems="center" display="flex">
                  <Button
                    onClick={() => setQueryDialogOpen(true)}
                    startIcon={isLocked ? <Visibility /> : <Edit />}
                    variant="outlined"
                  >
                    <Msg id={messageIds.targets.editButton} />
                  </Button>
                </Box>
              )}
              {targetedAndLocked && (
                <Button
                  onClick={() => setQueryDialogOpen(true)}
                  startIcon={isLocked ? <Visibility /> : <Edit />}
                  variant="outlined"
                >
                  <Msg id={messageIds.targets.viewButton} />
                </Button>
              )}
              {sent && (
                <Box alignItems="center" display="flex">
                  <Button
                    onClick={() => setQueryDialogOpen(true)}
                    startIcon={isLocked ? <Visibility /> : <Edit />}
                    variant="outlined"
                  >
                    <Msg id={messageIds.targets.viewButton} />
                  </Button>
                </Box>
              )}
              {isLoading && (
                <Button
                  startIcon={<CircularProgress size="1em" />}
                  variant="outlined"
                >
                  <Msg id={messageIds.targets.loading} />
                </Button>
              )}
              {!isLoading && (
                <Button
                  disabled={
                    readyTargets === 0 ||
                    state === EmailState.SCHEDULED ||
                    state === EmailState.SENT
                  }
                  onClick={onToggleLocked}
                  startIcon={isLocked ? <LockOpen /> : <Lock />}
                  variant={targetedNotLocked ? 'contained' : 'outlined'}
                >
                  <Msg
                    id={
                      isLocked
                        ? messageIds.targets.unlockButton
                        : messageIds.targets.lockButton
                    }
                  />
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
            updateTargets(query);
            setQueryDialogOpen(false);
          }}
          query={email?.target}
          readOnly={isLocked}
        />
      )}
    </>
  );
};

export default EmailTargets;
