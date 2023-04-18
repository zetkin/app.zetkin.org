import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Divider, lighten, Typography } from '@mui/material';
import { Close, OpenWith } from '@mui/icons-material';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';

const useStyles = makeStyles((theme) => ({
  instructions: {
    alignItems: 'center',
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    margin: '16px 16px 0px 16px',
    padding: 8,
  },
  moveIcon: {
    color: theme.palette.primary.main,
  },
}));

interface MoveLocationCardProps {
  location: ZetkinLocation;
  onCancel: () => void;
  onClose: () => void;
  onSaveLocation: (newLatLng: { lat: number; lng: number }) => void;
}

const MoveLocationCard: FC<MoveLocationCardProps> = ({
  location,
  onCancel,
  onClose,
  onSaveLocation,
}) => {
  const messages = useMessages(messageIds);
  const classes = useStyles();

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Box display="flex" justifyContent="space-between" padding={2}>
        <Typography variant="h5">{location.title}</Typography>
        <Close
          color="secondary"
          onClick={onClose}
          sx={{
            cursor: 'pointer',
          }}
        />
      </Box>
      <Divider />
      <Box className={classes.instructions}>
        <OpenWith className={classes.moveIcon} />
        <Typography sx={{ marginLeft: 1 }} variant="body2">
          {messages.locationModal.moveInstructions()}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" padding={2}>
        <Button onClick={onCancel}>{messages.locationModal.cancel()}</Button>
        <Button
          onClick={() => onSaveLocation({ lat: 3, lng: 4 })}
          variant="contained"
        >
          {messages.locationModal.saveLocation()}
        </Button>
      </Box>
    </Box>
  );
};

export default MoveLocationCard;
