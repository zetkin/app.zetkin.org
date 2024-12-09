import { ArrowForward, Delete } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FC } from 'react';

import messageIds from 'features/import/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { Gender, genders } from '../../../../hooks/useGenderMapping';

interface GenderConfigRowProps {
  italic?: boolean;
  numRows: number;
  onSelectGender: (gender: Gender | null) => void;
  onDeselectGender: () => void;
  selectedGender: Gender | 'unknown' | null;
  title: string;
}

const GenderConfigRow: FC<GenderConfigRowProps> = ({
  italic,
  numRows,
  onSelectGender,
  onDeselectGender,
  selectedGender,
  title,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Box
          alignItems="flex-start"
          display="flex"
          justifyContent="space-between"
          paddingTop={1}
          width="50%"
        >
          <Box display="flex" sx={{ wordBreak: 'break-all' }} width="100%">
            <Typography fontStyle={italic ? 'italic' : ''}>{title}</Typography>
          </Box>
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
        </Box>
        <Box
          alignItems="flex-start"
          display="flex"
          paddingRight={1}
          width="50%"
        >
          <FormControl fullWidth size="small">
            <InputLabel>
              <Msg id={messageIds.configuration.configure.genders.gender} />
            </InputLabel>
            <Select
              label={messages.configuration.configure.genders.gender()}
              onChange={(event) => {
                const { value } = event.target;
                if (value === 'm' || value === 'f' || value === 'o') {
                  onSelectGender(value);
                } else if (value === 'unknown') {
                  onSelectGender(null);
                }
              }}
              value={selectedGender}
            >
              {genders.map((key) => (
                <MenuItem key={key} value={key}>
                  <Msg
                    id={messageIds.configuration.configure.genders.genders[key]}
                  />
                </MenuItem>
              ))}
              <MenuItem value="unknown">
                <Msg
                  id={
                    messageIds.configuration.configure.genders.genders.unknown
                  }
                />
              </MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={() => {
              onDeselectGender();
            }}
          >
            <Delete color="secondary" />
          </IconButton>
        </Box>
      </Box>
      <Typography color="secondary">
        <Msg
          id={messageIds.configuration.configure.tags.numberOfRows}
          values={{ numRows }}
        />
      </Typography>
    </Box>
  );
};

export default GenderConfigRow;
