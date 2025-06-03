import { FC } from 'react';
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';

import useOrgUsers from '../hooks/useOrgUsers';
import { ZetkinOrgUser } from '../types';

type Props = {
  onSelect: (user: ZetkinOrgUser | null) => void;
  orgId: number;
};

const UserAutocomplete: FC<Props> = ({ onSelect, orgId }) => {
  const users = useOrgUsers(orgId);

  return (
    <Autocomplete
      getOptionLabel={(user) => `${user.first_name} ${user.last_name}`}
      onChange={(event, value) => {
        onSelect(value);
      }}
      options={users}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
      renderOption={(props, user) => (
        <ListItem {...props}>
          <ListItemAvatar>
            <Avatar src={`/api/users/${user.id}/avatar`} />
          </ListItemAvatar>
          <ListItemText
            primary={`${user.first_name} ${user.last_name}`}
            secondary={user.email}
          />
        </ListItem>
      )}
    />
  );
};

export default UserAutocomplete;
