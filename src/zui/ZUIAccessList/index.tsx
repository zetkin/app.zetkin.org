import { FC } from 'react';
import { Divider, FormControl, List, MenuItem, Select } from '@mui/material';

import AccessListItem from './AccessListItem';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinOfficial } from 'utils/types/zetkin';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { Msg, useMessages } from 'core/i18n';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'zui/l10n/messageIds';

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
  const messages = useMessages(messageIds);
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
              action={<Msg id={globalMessageIds.roles[item.role]} />}
              orgId={orgId}
              personId={item.id}
              subtitle="-"
              title={`${item.first_name} ${item.last_name}`}
            />
          </>
        );
      })}
      {accessList.map((item) => {
        const { person, level, updated, updated_by: sharer } = item;
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
                      <Msg id={globalMessageIds.accessLevels.readonly} />
                    </MenuItem>
                    <MenuItem value="edit">
                      <Msg id={globalMessageIds.accessLevels.edit} />
                    </MenuItem>
                    <MenuItem value="configure">
                      <Msg id={globalMessageIds.accessLevels.configure} />
                    </MenuItem>
                    <Divider />
                    <MenuItem value="delete">
                      <Msg id={messageIds.accessList.removeAccess} />
                    </MenuItem>
                  </Select>
                </FormControl>
              }
              orgId={orgId}
              personId={person.id}
              subtitle={messages.accessList.added({
                sharer: `${sharer.first_name} ${sharer.last_name}`,
                updated: (
                  <ZUIRelativeTime
                    convertToLocal
                    datetime={updated}
                    forcePast
                  />
                ),
              })}
              title={`${person.first_name} ${person.last_name}`}
            />
          </>
        );
      })}
    </List>
  );
};

export default ZUIAccessList;
