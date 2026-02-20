import { FC, useState } from 'react';
import {
  Autocomplete,
  Avatar,
  FilterOptionsState,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import Fuse from 'fuse.js';

import useOrgUsers from '../hooks/useOrgUsers';
import { ZetkinOrgUser } from '../types';

type Props = {
  onSelect: (user: ZetkinOrgUser | null) => void;
  orgId: number;
};

const UserAutocomplete: FC<Props> = ({ onSelect, orgId }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<ZetkinOrgUser | null>(null);
  const users = useOrgUsers(orgId);

  const filterOptions = (
    options: ZetkinOrgUser[],
    state: FilterOptionsState<ZetkinOrgUser>
  ): ZetkinOrgUser[] => {
    const inputValue = state.inputValue.trim();

    if (inputValue.length === 0) {
      return options;
    }

    const fuse = new Fuse(options, {
      keys: ['first_name', 'last_name', 'email'],
      threshold: 0.4,
    });

    return fuse.search(inputValue).map((result) => result.item);
  };

  return (
    <Autocomplete
      filterOptions={filterOptions}
      getOptionKey={(user) => user.id}
      getOptionLabel={(user) => `${user.first_name} ${user.last_name}`}
      inputValue={searchValue}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, value) => {
        onSelect(value);
        setSelectedUser(null);
        setSearchValue('');
      }}
      onInputChange={(_, value) => {
        setSearchValue(value);
      }}
      options={users}
      renderInput={(params) => (
        <TextField
          {...params}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
            },
          }}
        />
      )}
      renderOption={(props, user) => {
        const { key, ...optionProps } = props;
        return (
          <ListItem key={key} {...optionProps}>
            <ListItemAvatar>
              <Avatar src={`/api/users/${user.id}/avatar`} />
            </ListItemAvatar>
            <ListItemText
              primary={`${user.first_name} ${user.last_name}`}
              secondary={user.email}
            />
          </ListItem>
        );
      }}
      value={selectedUser}
    />
  );
};

export default UserAutocomplete;
