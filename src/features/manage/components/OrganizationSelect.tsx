import { Dispatch, SetStateAction, FC, useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';
import {
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import ZUITextField from 'zui/components/ZUITextField';
import useMessages from 'core/i18n/useMessages';
import messageIds from 'features/manage/l10n/messageIds';
import useOrganizationSearch from 'features/organizations/hooks/useOrganizationSearch';
import { ZetkinOrganization } from 'utils/types/zetkin';

const OrganizationSelect: FC<{
  onSelect: (organization: ZetkinOrganization | null) => void;
  setSubmitDisabled: Dispatch<SetStateAction<boolean>>;
}> = ({ onSelect, setSubmitDisabled }) => {
  const messages = useMessages(messageIds);
  const [query, setQuery] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const { error, isLoading, organizations } = useOrganizationSearch(query);

  useEffect(() => {
    setSubmitDisabled(selectedOrgId === null);
  }, [selectedOrgId, setSubmitDisabled]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
          }
        }}
      >
        <ZUITextField
          fullWidth
          label={messages.users.orgs.select.search()}
          onChange={(value) => {
            setQuery(value);
            setSelectedOrgId(null);
            onSelect(null);
          }}
          startIcon={Search}
          value={query}
        />
      </Box>
      {isLoading && <CircularProgress size={24} />}
      {!!error && (
        <Alert severity="error">{messages.users.orgs.select.failed()}</Alert>
      )}
      {!!query.trim() && !isLoading && !error && organizations.length === 0 && (
        <Typography>{messages.users.orgs.select.noResults()}</Typography>
      )}
      <RadioGroup
        aria-label={messages.users.orgs.select.search()}
        onChange={(_, value) => {
          const organization = organizations.find(
            (organization) => organization.id === Number(value)
          );
          if (organization) {
            setSelectedOrgId(organization.id);
            onSelect(organization);
          }
        }}
        sx={{ maxHeight: 320, overflowY: 'auto' }}
        value={selectedOrgId ?? ''}
      >
        {organizations.map((organization) => (
          <FormControlLabel
            key={organization.id}
            control={<Radio />}
            label={organization.title}
            value={organization.id}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default OrganizationSelect;
