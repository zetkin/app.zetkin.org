import { FC, useEffect, useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import { ShortText } from '@mui/icons-material';

import BaseOpConfig from './BaseOpConfig';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'features/automations/l10n/messageIds';
import globMessageIds from 'core/i18n/messageIds';
import { PersonSetfieldsBulkOp } from 'features/import/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import ZUIFuture from 'zui/ZUIFuture';

type Props = {
  config: PersonSetfieldsBulkOp | null;
  onChange: (newConfig: PersonSetfieldsBulkOp) => void;
  onDelete: () => void;
};

const SetFieldConfig: FC<Props> = ({ config, onChange, onDelete }) => {
  const { orgId } = useNumericRouteParams();
  const [selectedSlug, setSelectedSlug] = useState('');
  const fieldsFuture = useCustomFields(orgId);
  const messages = useMessages(messageIds);
  const globMessages = useMessages(globMessageIds);

  useEffect(() => {
    const configuredData = config?.data || {};
    const firstKeyWithValue = Object.keys(configuredData).find(
      (key) => !!configuredData[key]
    );

    if (firstKeyWithValue != selectedSlug) {
      setSelectedSlug(firstKeyWithValue || '');
    }
  }, [config?.data]);

  const nativeFields = [
    {
      label: globMessages.personFields.first_name(),
      slug: 'first_name',
    },
    {
      label: globMessages.personFields.last_name(),
      slug: 'last_name',
    },
    {
      label: globMessages.personFields.gender(),
      slug: 'gender',
    },
    {
      label: globMessages.personFields.email(),
      slug: 'email',
    },
    {
      label: globMessages.personFields.phone(),
      slug: 'phone',
    },
    {
      label: globMessages.personFields.alt_phone(),
      slug: 'alt_phone',
    },
    {
      label: globMessages.personFields.co_address(),
      slug: 'co_address',
    },
    {
      label: globMessages.personFields.street_address(),
      slug: 'street_address',
    },
    {
      label: globMessages.personFields.zip_code(),
      slug: 'zip_code',
    },
    {
      label: globMessages.personFields.city(),
      slug: 'city',
    },
    {
      label: globMessages.personFields.country(),
      slug: 'country',
    },
  ];

  return (
    <BaseOpConfig
      icon={<ShortText />}
      label={messages.opConfig.opTypes.setFields.typeLabel()}
      onDelete={onDelete}
    >
      <ZUIFuture future={fieldsFuture}>
        {(customFields) => {
          return (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'stretch',
                width: '100%',
              }}
            >
              <TextField
                fullWidth
                label={messages.opConfig.opTypes.setFields.fieldLabel()}
                onChange={(ev) => setSelectedSlug(ev.target.value)}
                select
                size="small"
                value={selectedSlug}
              >
                {nativeFields.map((field) => (
                  <MenuItem key={field.slug} value={field.slug}>
                    {field.label}
                  </MenuItem>
                ))}
                {customFields
                  .filter((field) => field.type != 'json')
                  .map((field) => (
                    <MenuItem key={field.slug} value={field.slug}>
                      {field.title}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                disabled={!selectedSlug}
                fullWidth
                label={messages.opConfig.opTypes.setFields.valueLabel()}
                onChange={(ev) =>
                  onChange({
                    data: { [selectedSlug]: ev.target.value },
                    op: 'person.setfields',
                  })
                }
                size="small"
                value={config?.data[selectedSlug] || ''}
              />
            </Box>
          );
        }}
      </ZUIFuture>
    </BaseOpConfig>
  );
};

export default SetFieldConfig;
