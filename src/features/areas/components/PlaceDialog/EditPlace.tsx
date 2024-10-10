import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FC } from 'react';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import { PlaceType } from '.';

type EditPlaceProps = {
  description: string;
  onDescriptionChange: (newDescription: string) => void;
  onTitleChange: (newTitle: string) => void;
  onTypeChange: (newType: PlaceType) => void;
  title: string;
  type: PlaceType;
};

const EditPlace: FC<EditPlaceProps> = ({
  description,
  onDescriptionChange,
  onTitleChange,
  onTypeChange,
  title,
  type,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      height="100%"
      paddingTop={2}
    >
      <TextField
        defaultValue={title}
        fullWidth
        label={messages.place.editTitle()}
        onChange={(ev) => onTitleChange(ev.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel id="type-of-place-label">
          <Msg id={messageIds.place.selectType} />
        </InputLabel>
        <Select
          fullWidth
          label={messages.placeCard.inputLabel()}
          labelId="type-of-place-label"
          onChange={(ev) => onTypeChange(ev.target.value as PlaceType)}
          value={type}
        >
          <MenuItem value="address">
            <Msg id={messageIds.placeCard.address} />
          </MenuItem>
          <MenuItem value="misc">
            <Msg id={messageIds.placeCard.misc} />
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        defaultValue={description}
        fullWidth
        label={messages.place.editDescription()}
        multiline
        onChange={(ev) => onDescriptionChange(ev.target.value)}
        rows={5}
      />
    </Box>
  );
};

export default EditPlace;
