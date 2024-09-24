import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { FC, useState } from 'react';
import { makeStyles } from '@mui/styles';

import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

export const useStyles = makeStyles(() => ({
  card: {
    bottom: 15,
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
}));

type AddPlaceDialogProps = {
  onClose: () => void;
  onCreate: (title: string, type: string) => void;
};

export const CreatePlaceCard: FC<AddPlaceDialogProps> = ({
  onClose,
  onCreate,
}) => {
  const classes = useStyles();
  const messages = useMessages(messageIds);

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  return (
    <Box className={classes.card}>
      <Card sx={{ width: '90%' }}>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="type-of-place-label">
              <Msg id={messageIds.placeCard.inputLabel} />
            </InputLabel>
            <Select
              fullWidth
              label={messages.placeCard.inputLabel()}
              labelId="type-of-place-label"
              onChange={handleChange}
              value={type}
            >
              <MenuItem value="address">
                <Msg id={messageIds.placeCard.address} />
              </MenuItem>
              <MenuItem value="misc">
                <Msg id={messageIds.placeCard.misc} />
              </MenuItem>
            </Select>
            <TextField
              fullWidth
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder={
                type === 'address'
                  ? messages.placeCard.placeholderAddress()
                  : messages.placeCard.placeholderTitle()
              }
              sx={{ paddingTop: 1 }}
            />
          </FormControl>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose} size="small" variant="outlined">
            <Msg id={messageIds.placeCard.cancel} />
          </Button>
          <Button
            onClick={() => {
              onCreate(title, type);
              onClose();
            }}
            size="small"
            variant="contained"
          >
            <Msg id={messageIds.placeCard.createPlace} />
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
