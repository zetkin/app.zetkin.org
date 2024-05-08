import { makeStyles } from '@mui/styles';
import { Add, Edit, Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
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
  isLocked: boolean;
  state: EmailState;
  targets: number;
  updateTargets: (filter_spec: Pick<ZetkinQuery, 'filter_spec'>) => void;
}

const EmailTargets: FC<EmailTargetsProps> = ({
  email,
  isTargeted,
  isLocked,
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

  return (
    <>
      <Card>
        <Box display="flex" justifyContent="space-between" p={2}>
          <Typography variant="h4">
            <Msg id={messageIds.targets.title} />
          </Typography>
          <ZUIAnimatedNumber value={targets}>
            {(animatedValue) => (
              <Box className={classes.chip}>{animatedValue}</Box>
            )}
          </ZUIAnimatedNumber>
        </Box>
        <Divider />
        <Box pb={2}>
          <Box bgcolor="background.secondary" p={2}>
            <Typography>
              <Msg
                id={
                  sent
                    ? messageIds.targets.sentSubtitle
                    : messageIds.targets.subtitle
                }
              />
            </Typography>
            <Box pt={1}>
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
                <Box alignItems="center" display="flex">
                  <Button
                    onClick={() => setQueryDialogOpen(true)}
                    startIcon={isLocked ? <Visibility /> : <Edit />}
                    variant="outlined"
                  >
                    <Msg id={messageIds.targets.viewButton} />
                  </Button>
                  <Typography
                    sx={{ color: theme.palette.statusColors.orange, ml: 2 }}
                  >
                    <Msg id={messageIds.targets.locked} />
                  </Typography>
                </Box>
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
