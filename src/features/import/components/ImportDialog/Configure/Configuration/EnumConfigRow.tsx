import { ArrowForward, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'features/import/l10n/messageIds';
import { EnumChoice } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

interface EnumConfigRowProps {
  italic?: boolean;
  numRows: number;
  onSelectOption: (key: string) => void;
  onDeselectOption: () => void;
  options: EnumChoice[];
  selectedOption: string | null;
  title: string;
}

const EnumConfigRow: FC<EnumConfigRowProps> = ({
  italic,
  numRows,
  onSelectOption,
  onDeselectOption,
  options,
  selectedOption,
  title,
}) => {
  const messages = useMessages(messageIds);
  const [mapping, setMapping] = useState(false);

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
              <Msg id={messageIds.configuration.configure.enum.option} />
            </InputLabel>
            <Select
              label={messages.configuration.configure.enum.option()}
              onChange={(event) => {
                if (typeof event.target.value == 'string') {
                  onSelectOption(event.target.value);
                }
              }}
              value={selectedOption || ''}
            >
              {options.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            onClick={() => {
              onDeselectOption();
              setMapping(false);
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

export default EnumConfigRow;
