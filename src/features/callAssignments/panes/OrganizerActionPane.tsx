import { FC, useMemo } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Typography } from '@mui/material';
import { Check, PriorityHigh } from '@mui/icons-material';

import CallModel from '../models/CallModel';
import PaneHeader from 'utils/panes/PaneHeader';
import { personResource } from 'features/profile/api/people';
import useModel from 'core/useModel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import { ZetkinOrganizerAction } from 'utils/types/zetkin';

interface OrganizerActionPaneProps {
  columnIdx: number;
  orgId: number;
  personId: number;
  viewModel: ViewDataModel;
}

const useStyles = makeStyles(() => ({
  buttonBox: {
    display: 'flex',
    justifyContent: 'end',
  },
}));

export const OrganizerActionPane: FC<OrganizerActionPaneProps> = ({
  orgId,
  personId,
  columnIdx,
  viewModel,
}) => {
  const rows = viewModel.getRows().data;
  const row = rows?.find((r) => r.id == personId);
  let calls = row?.content[columnIdx] as ZetkinOrganizerAction[];
  if (!calls) {
    calls = [];
  }

  const messages = useMessages(messageIds);
  const model = useModel((env) => new CallModel(env, orgId));
  const { data: recipient } = personResource(
    orgId.toString(),
    personId.toString()
  ).useQuery();

  // Sort first according to date ascending, then organizer action needed first
  const sorted: ZetkinOrganizerAction[] = useMemo(
    () =>
      [...calls]
        .sort((call0, call1) => {
          const d0 = new Date(call0?.update_time || 0);
          const d1 = new Date(call1?.update_time || 0);
          return d1.getTime() - d0.getTime();
        })
        .sort((call0, call1) => {
          if (
            !call0?.organizer_action_taken &&
            !!call1?.organizer_action_taken
          ) {
            return -1;
          } else if (
            !!call0?.organizer_action_taken &&
            !call1?.organizer_action_taken
          ) {
            return 1;
          } else {
            return 0;
          }
        }),
    [calls]
  );

  return (
    <>
      <PaneHeader
        subtitle={
          recipient && (
            <Msg
              id={messageIds.organizerActionPane.subtitle}
              values={{
                person: <ZUIPersonLink person={recipient} />,
              }}
            />
          )
        }
        title={messages.organizerActionPane.title()}
      />
      {sorted.map((call) => (
        <Box key={call?.id}>
          <Typography>
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
          <Typography>{call?.message_to_organizer}</Typography>
          {!call?.organizer_action_taken ? (
            <Button
              onClick={() => call && model.setOrganizerActionTaken(call.id)}
              startIcon={<Check />}
              variant="contained"
            >
              <Msg id={messageIds.organizerActionPane.markAsSolved} />
            </Button>
          ) : (
            <Button
              onClick={() => call && model.setOrganizerActionNeeded(call.id)}
              variant="outlined"
            >
              <PriorityHigh />
              <Msg id={messageIds.organizerActionPane.markAsUnsolved} />
            </Button>
          )}
        </Box>
      ))}
    </>
  );
};
