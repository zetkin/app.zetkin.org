import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Divider,
  FormControl,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinOfficial } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

interface ZUIAccessListProps {
  accessList: ZetkinObjectAccess[];
  officials: ZetkinOfficial[];
  onChangeLevel?: (
    personId: number,
    level: ZetkinObjectAccess['level']
  ) => void;
  onRevoke?: (personId: number) => void;
  orgId: number;
}

const ZUIAccessList: FC<ZUIAccessListProps> = ({
  accessList,
  officials,
  onChangeLevel,
  onRevoke,
  orgId,
}) => {
  return (
    <List>
      {officials.map((item) => {
        return (
          <>
            <ListItem>
              <Box
                alignItems="center"
                display="flex"
                gap={2}
                p={1}
                width="100%"
              >
                <Box>
                  <ZUIAvatar orgId={orgId} personId={item.id} />
                </Box>
                <Box flexGrow={1}>
                  <Typography>{`${item.first_name} ${item.last_name}`}</Typography>
                </Box>
                <Box>
                  <FormattedMessage id={`zui.accessList.roles.${item.role}`} />
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </>
        );
      })}
      {accessList.map((item) => {
        const { person, level } = item;
        return (
          <>
            <ListItem>
              <Box
                alignItems="center"
                display="flex"
                gap={2}
                p={1}
                width="100%"
              >
                <Box>
                  <ZUIAvatar orgId={orgId} personId={item.person.id} />
                </Box>
                <Box flexGrow={1}>
                  <Typography>
                    {`${person.first_name} ${person.last_name}`}
                  </Typography>
                </Box>
                <Box>
                  <FormControl fullWidth size="small">
                    <Select
                      onChange={(ev) => {
                        const level = ev.target.value;
                        if (
                          level == 'configure' ||
                          level == 'edit' ||
                          level == 'readonly'
                        ) {
                          if (onChangeLevel) {
                            onChangeLevel(person.id, level);
                          }
                        } else if (level == 'delete' && onRevoke) {
                          onRevoke(person.id);
                        }
                      }}
                      value={level}
                    >
                      <MenuItem value="readonly">
                        <FormattedMessage id="zui.accessList.levels.readonly" />
                      </MenuItem>
                      <MenuItem value="edit">
                        <FormattedMessage id="zui.accessList.levels.edit" />
                      </MenuItem>
                      <MenuItem value="configure">
                        <FormattedMessage id="zui.accessList.levels.configure" />
                      </MenuItem>
                      <Divider />
                      <MenuItem value="delete">
                        <FormattedMessage id="zui.accessList.removeAccess" />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </>
        );
      })}
    </List>
  );
};

export default ZUIAccessList;
