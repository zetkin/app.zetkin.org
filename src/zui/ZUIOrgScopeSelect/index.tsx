import { FC } from 'react';
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import messageIds from 'zui/l10n/messageIds';
import { ZetkinSubOrganization } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';
import useZUIOrgScopeSelect, { Scope } from './useZUIOrgScopeSelect';

type ValueType = 'all' | 'suborgs' | number[];

type Props = {
  onChange: (value: ValueType) => void;
  orgId: number;
  organizations: ZetkinSubOrganization[];
  value: ValueType;
};

const ZUIOrgScopeSelect: FC<Props> = ({
  onChange,
  organizations,
  orgId,
  value,
}) => {
  const messages = useMessages(messageIds);
  const { orgs, setOrgs, scope, setScope } = useZUIOrgScopeSelect({
    currentOrg: orgId,
    onChange,
    value,
  });

  const curOrgTitle = organizations.find((org) => org.id == orgId)?.title ?? '';

  return (
    <Box sx={{ width: 300 }}>
      <Select
        fullWidth
        onChange={(ev) => setScope(ev.target.value as Scope)}
        value={scope}
      >
        <MenuItem value="all">
          <Msg
            id={messageIds.orgScopeSelect.scope.all}
            values={{ org: curOrgTitle }}
          />
        </MenuItem>
        <MenuItem value="this">
          <Msg
            id={messageIds.orgScopeSelect.scope.this}
            values={{ org: curOrgTitle }}
          />
        </MenuItem>
        <MenuItem value="suborgs">
          <Msg id={messageIds.orgScopeSelect.scope.suborgs} />
        </MenuItem>
        <MenuItem value="specific">
          <Msg id={messageIds.orgScopeSelect.scope.specific} />
        </MenuItem>
      </Select>
      {scope == 'specific' && (
        <Autocomplete
          filterOptions={(options, state) =>
            options.filter((opt) =>
              opt.title.toLowerCase().includes(state.inputValue.toLowerCase())
            )
          }
          getOptionLabel={(opt) => opt.title}
          multiple={true}
          onChange={(ev, value) => setOrgs(value.map((org) => org.id))}
          options={organizations}
          renderInput={(props) => {
            return (
              <TextField
                {...props}
                placeholder={messages.orgScopeSelect.orgPlaceholder()}
                variant="outlined"
              />
            );
          }}
          renderOption={(props, option, { selected }) => {
            return (
              <ListItem {...props} key={option.id} value={option.id}>
                <Checkbox checked={selected} />
                <ListItemText primary={option.title} />
              </ListItem>
            );
          }}
          renderTags={(tagValue) => {
            return (
              <Chip
                label={
                  <Msg
                    id={messageIds.orgScopeSelect.orgSelectionLabel}
                    values={{ count: tagValue.length }}
                  />
                }
              />
            );
          }}
          value={orgs.map(
            (orgId) => organizations.find((org) => org.id == orgId)!
          )}
        />
      )}
    </Box>
  );
};

export default ZUIOrgScopeSelect;
