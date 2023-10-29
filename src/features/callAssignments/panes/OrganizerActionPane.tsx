import { Box, Button, Typography } from '@mui/material';
import { Check, PriorityHigh } from '@mui/icons-material';
import { FC, useMemo } from 'react';

import messageIds from '../l10n/messageIds';
import PaneHeader from 'utils/panes/PaneHeader';
import { personResource } from 'features/profile/api/people';
import useCall from '../hooks/useCall';
import useViewGrid from 'features/views/hooks/useViewGrid';
import { ZetkinOrganizerAction } from 'utils/types/zetkin';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { Msg, useMessages } from 'core/i18n';

interface OrganizerActionPaneProps {
  columnIdx: number;
  orgId: number;
  personId: number;
  viewId: number;
}

export const OrganizerActionPane: FC<OrganizerActionPaneProps> = ({
  orgId,
  personId,
  columnIdx,
  viewId,
}) => {
  const { rowsFuture } = useViewGrid(orgId, viewId);
  const rows = rowsFuture.data;
  const row = rows?.find((r) => r.id == personId);
  let calls = row?.content[columnIdx] as ZetkinOrganizerAction[];
  if (!calls) {
    calls = [];
  }

  const messages = useMessages(messageIds);
  const { data: recipient } = personResource(
    orgId.toString(),
    personId.toString()
  ).useQuery();

  const { setOrganizerActionNeeded, setOrganizerActionTaken } = useCall(orgId);

  const sorted: ZetkinOrganizerAction[] = useMemo(
    () =>
      [...calls].sort((call0, call1) => {
        const d0 = new Date(call0?.update_time || 0);
        const d1 = new Date(call1?.update_time || 0);
        return d1.getTime() - d0.getTime();
      }),
    [calls]
  );

  return (
    <>
      <PaneHeader
        subtitle={
          recipient && (
            <Typography variant="body2">
              <Msg
                id={messageIds.organizerActionPane.subtitle}
                values={{
                  person: <ZUIPersonLink person={recipient} />,
                }}
              />
            </Typography>
          )
        }
        title={messages.organizerActionPane.title()}
      />
      {sorted.map((call) => (
        <Box key={call?.id} mt={4}>
          <Typography variant="body2">
            <Msg
              id={messageIds.organizerActionPane.noteByCaller}
              values={{
                person: call && (
                  <ZUIPersonLink
                    person={
                      call.caller as {
                        first_name: string;
                        id: number;
                        last_name: string;
                        name?: string;
                      }
                    }
                  />
                ),
                time: call && <ZUIRelativeTime datetime={call.update_time} />,
              }}
            />
          </Typography>
          <Box my={1}>
            {call?.message_to_organizer ? (
              <Typography>{call.message_to_organizer}</Typography>
            ) : (
              <Typography sx={{ color: 'GrayText', fontStyle: 'italic' }}>
                <Msg id={messageIds.organizerActionPane.messagePlaceholder} />
              </Typography>
            )}
          </Box>
          <Box display="flex" justifyContent="flex-end" my={2}>
            {!call?.organizer_action_taken ? (
              <Button
                onClick={() => call && setOrganizerActionTaken(call.id)}
                startIcon={<Check />}
                variant="contained"
              >
                <Msg id={messageIds.organizerActionPane.markAsSolved} />
              </Button>
            ) : (
              <Button
                onClick={() => call && setOrganizerActionNeeded(call.id)}
                startIcon={<PriorityHigh />}
                variant="text"
              >
                <Msg id={messageIds.organizerActionPane.markAsUnsolved} />
              </Button>
            )}
          </Box>
        </Box>
      ))}
    </>
  );
};
