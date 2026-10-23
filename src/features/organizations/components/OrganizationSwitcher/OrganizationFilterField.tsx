import { FC } from 'react';
import { Close, FilterListOutlined } from '@mui/icons-material';
import { TextField } from '@mui/material';

import { useMessages } from 'core/i18n';
import zuiMessageIds from 'zui/l10n/messageIds';

interface OrganizationFilterFieldProps {
  onChange: (value: string) => void;
  value: string;
}

const OrganizationFilterField: FC<OrganizationFilterFieldProps> = ({
  onChange,
  value,
}) => {
  const messages = useMessages(zuiMessageIds);

  return (
    <TextField
      aria-label={messages.organizeSidebar.filterLabel()}
      fullWidth
      InputProps={{
        endAdornment:
          value.length > 0 ? (
            <Close
              color="secondary"
              onClick={() => onChange('')}
              sx={{ cursor: 'pointer' }}
            />
          ) : (
            ''
          ),
        startAdornment: (
          <FilterListOutlined color="secondary" sx={{ marginRight: '0.5em' }} />
        ),
      }}
      onChange={(e) => onChange(e.target.value)}
      placeholder={messages.organizeSidebar.filter()}
      size="small"
      value={value}
    />
  );
};

export default OrganizationFilterField;
