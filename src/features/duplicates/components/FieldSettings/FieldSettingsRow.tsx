import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';

import messageIds from 'features/duplicates/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import { Msg, useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import { usePersons } from 'features/profile/hooks/usePerson';
import { PersonWithUpdates } from 'features/profile/types/PersonWithUpdates';
import useFeature from 'utils/featureFlags/useFeature';
import { UPDATEDATE } from 'utils/featureFlags';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import useFieldTitle from 'utils/hooks/useFieldTitle';

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
  const getFieldTitle = useFieldTitle(orgId);

  const updatesEnabled = useFeature(UPDATEDATE);
  const personIds = useMemo(
    () => (updatesEnabled ? duplicates.map((person) => person.id) : []),
    [duplicates, updatesEnabled]
  );
  const duplicatesWithAdditionalData = usePersons(orgId, personIds);

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

  const getAvatars = (value: string) => {
    const peopleWithMatchingValues = duplicates.filter(
      (person) => person[field] == value
    );

    return (
      <Box alignItems="center" display="flex" gap="2px">
        {peopleWithMatchingValues.map((person, index) => {
          return (
            <ZUIAvatar
              key={index}
              size={'xs'}
              url={`/api/orgs/${orgId}/people/${person.id}/avatar`}
            />
          );
        })}
      </Box>
    );
  };

  const getUpdatedDate = (value: string) => {
    const futureDataForPeopleWithMatchingValues = duplicates
      .map(
        (person, idx) =>
          [duplicatesWithAdditionalData[idx], person[field]] as const
      )
      .filter(([future, fieldValue]) => fieldValue === value && !!future)
      .map(([{ data }]) => data as PersonWithUpdates | null);

    const lastUpdated = futureDataForPeopleWithMatchingValues
      .map((person) => person?._history?.fields[field])
      .filter((date): date is string => !!date)
      .sort()
      .at(-1);

    if (!lastUpdated) {
      return null;
    }

    return (
      <>
        <Msg id={messageIds.modal.changedDateTooltip} />{' '}
        <ZUIRelativeTime datetime={lastUpdated} />
      </>
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
          <Typography>{getFieldTitle(field)}</Typography>
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
                <MenuItem key={index} value={value}>
                  <Tooltip placement="left" title={getUpdatedDate(value)}>
                    <Box
                      alignContent="center"
                      display="flex"
                      gap={1}
                      justifyContent="space-between"
                      sx={{ width: '100%' }}
                    >
                      {getLabel(value)}
                      {getAvatars(value)}
                    </Box>
                  </Tooltip>
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
