import { ArrowForward } from '@mui/icons-material';
import { Box, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'features/duplicates/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import sortValuesByFrequency from 'features/duplicates/utils/sortValuesByFrequency';
import { Msg, useMessages } from 'core/i18n';

interface FieldSettingsRowProps {
  field: NATIVE_PERSON_FIELDS;
  values: string[];
}

const FieldSettingsRow: FC<FieldSettingsRowProps> = ({ field, values }) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [selectedValue, setSelectedValue] = useState(values[0]);

  const sortedValues = sortValuesByFrequency(values);

  const getLabel = (value: string) => {
    if (field === NATIVE_PERSON_FIELDS.GENDER) {
      if (value === 'f') {
        return messages.modal.fieldSettings.gender.f();
      } else if (value === 'm') {
        return messages.modal.fieldSettings.gender.m();
      } else {
        return messages.modal.fieldSettings.gender.o();
      }
    }

    if (!value) {
      return (
        <span style={{ fontStyle: 'italic' }}>
          {messages.modal.fieldSettings.noValue()}
        </span>
      );
    }

    return value;
  };

  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      padding={1}
    >
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        width="50%"
      >
        <Box
          bgcolor={theme.palette.grey[200]}
          padding={1}
          sx={{ borderRadius: 2 }}
        >
          <Typography>
            <Msg id={globalMessageIds.personFields[field]} />
          </Typography>
        </Box>
        <ArrowForward color="secondary" />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        paddingLeft={1}
        width="50%"
      >
        {sortedValues.length === 1 && (
          <Typography color="secondary">{getLabel(sortedValues[0])}</Typography>
        )}
        {sortedValues.length > 1 && (
          <Select
            fullWidth
            onChange={(event) => setSelectedValue(event.target.value)}
            value={selectedValue}
          >
            {sortedValues.map((value, index) => (
              <MenuItem key={index} value={value}>
                {getLabel(value)}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>
    </Box>
  );
};

export default FieldSettingsRow;
