import { FC } from 'react';
import { Divider, FormControl, List, MenuItem, Select } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import AccessListItem from './AccessListItem';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinOfficial } from 'utils/types/zetkin';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

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
  const intl = useIntl();
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
              subtitle={intl.formatMessage(
                { id: 'zui.accessList.added' },
                {
                  sharer: `${sharer.first_name} ${sharer.last_name}`,
                  updated: (
                    <ZUIRelativeTime
                      convertToLocal
                      datetime={updated}
                      forcePast
                    />
                  ),
                }
              )}
              title={`${person.first_name} ${person.last_name}`}
            />
          </>
        );
      })}
    </List>
  );
};

export default ZUIAccessList;
