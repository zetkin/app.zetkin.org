import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'features/duplicates/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { Msg, useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

interface FieldSettingsRowProps {
  duplicates: ZetkinPerson[];
  field: NATIVE_PERSON_FIELDS;
  onChange: (selectedValue: string) => void;
  values: string[];
}

const FieldSettingsRow: FC<FieldSettingsRowProps> = ({
  duplicates,
  field,
  onChange,
  values,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [selectedValue, setSelectedValue] = useState(values[0]);
  const { orgId } = useNumericRouteParams();

  const getLabel = (value: string) => {
    if (field === NATIVE_PERSON_FIELDS.GENDER) {
      if (value === 'f') {
        return messages.modal.fieldSettings.gender.f();
      } else if (value === 'm') {
        return messages.modal.fieldSettings.gender.m();
      } else if (value === 'o') {
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

  const getAvatars = (value: String) => {
    const peopleWithMatchingValues = duplicates.filter(
      (person) => person[field] == value
    );

    return (
      <Box display="flex" gap="2px">
        {peopleWithMatchingValues.map((person) => {
          return (
            <ZUIAvatar
              size={'xs'}
              url={`/api/orgs/${orgId}/people/${person.id}/avatar`}
            />
          );
        })}
      </Box>
    );
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
      </Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        paddingLeft={1}
        width="50%"
      >
        {values.length <= 1 && (
          <Typography color="secondary">{getLabel(values[0])}</Typography>
        )}
        {values.length > 1 && (
          <FormControl fullWidth size="small">
            <Select
              onChange={(event) => {
                setSelectedValue(event.target.value);
                onChange(event.target.value);
              }}
              renderValue={() => getLabel(selectedValue)}
              value={selectedValue}
            >
              {values.map((value, index) => (
                <MenuItem
                  key={index}
                  value={value}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  {getLabel(value)}
                  {getAvatars(value)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </Box>
  );
};

export default FieldSettingsRow;
