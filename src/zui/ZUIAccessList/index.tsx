import { FC } from 'react';
import { Divider, FormControl, List, MenuItem, Select } from '@mui/material';

import AccessListItem from './AccessListItem';
import { ListAccessLevel, ZetkinListAccess } from 'core/api/types';
import { ZetkinOfficial } from 'utils/types/zetkin';
import useOrgUsers from 'features/user/hooks/useOrgUsers';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { Msg, useMessages } from 'core/i18n';
import globalMessageIds from 'core/i18n/messageIds';
import messageIds from 'zui/l10n/messageIds';

interface ZUIAccessListProps {
  accessList: ZetkinListAccess[];
  officials: ZetkinOfficial[];
  onChangeLevel?: (userId: number, level: ListAccessLevel) => void;
  onRevoke?: (userId: number) => void;
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
  const orgUsers = useOrgUsers(orgId);

  const usersById = new Map(orgUsers.map((user) => [user.id, user]));

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
        const { level, granted, granted_by_user_id: grantedByUserId } = item;
        const user = usersById.get(item.user_id);
        const sharer = grantedByUserId
          ? usersById.get(grantedByUserId)
          : undefined;
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
                          onChangeLevel(item.user_id, level);
                        }
                      } else if (level == 'delete' && onRevoke) {
                        onRevoke(item.user_id);
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
              subtitle={
                user
                  ? messages.accessList.added({
                      sharer: sharer
                        ? `${sharer.first_name} ${sharer.last_name}`
                        : '-',
                      updated: (
                        <ZUIRelativeTime
                          convertToLocal
                          datetime={granted}
                          forcePast
                        />
                      ),
                    })
                  : messages.accessList.notAMember()
              }
              title={
                user
                  ? `${user.first_name} ${user.last_name}`
                  : `#${item.user_id}`
              }
              userId={item.user_id}
            />
          </>
        );
      })}
    </List>
  );
};

export default ZUIAccessList;
