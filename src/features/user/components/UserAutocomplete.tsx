import { FC } from 'react';
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
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, value) => {
        onSelect(value);
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
    />
  );
};

export default UserAutocomplete;
