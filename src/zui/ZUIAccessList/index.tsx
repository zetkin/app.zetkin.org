import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Divider, FormControl, List, MenuItem, Select } from '@mui/material';

import AccessListItem from './AccessListItem';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinOfficial } from 'utils/types/zetkin';

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
  let first = true;
  return (
    <List>
      {officials.map((item) => {
        const showDivider = !first;
        first = false;
        return (
          <>
            {showDivider && <Divider />}
            <AccessListItem
              action={
                <FormattedMessage id={`zui.accessList.roles.${item.role}`} />
              }
              orgId={orgId}
              personId={item.id}
              title={`${item.first_name} ${item.last_name}`}
            />
          </>
        );
      })}
      {accessList.map((item) => {
        const { person, level } = item;
        const showDivider = !first;
        first = false;
        return (
          <>
            {showDivider && <Divider />}
            <AccessListItem
              action={
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
              }
              orgId={orgId}
              personId={person.id}
              title={`${person.first_name} ${person.last_name}`}
            />
          </>
        );
      })}
    </List>
  );
};

export default ZUIAccessList;
