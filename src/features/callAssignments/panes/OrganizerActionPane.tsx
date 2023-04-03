import { Box, Button, Typography } from '@mui/material';
import { CallSharp, Check, PriorityHigh } from '@mui/icons-material';
import { FC, useMemo } from 'react';
import { Msg, useMessages } from 'core/i18n';

import { Call } from '../apiTypes';
import CallModel from '../models/CallModel';
import PaneHeader from 'utils/panes/PaneHeader';
import useModel from 'core/useModel';
import { ZetkinOrganizerAction, ZetkinViewRow } from 'utils/types/zetkin';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

import messageIds from '../l10n/messageIds';
import ViewDataModel from 'features/views/models/ViewDataModel';

interface OrganizerActionPaneProps {
  columnIdx: number;
  orgId: number;
  personId: number;
  viewModel: ViewDataModel;
}

export const OrganizerActionPane: FC<OrganizerActionPaneProps> = ({
  orgId,
  personId,
  columnIdx,
  viewModel,
}) => {
  const rows = viewModel.getRows().data;
  const row = rows?.find((r) => r.id == personId);
  const calls = row?.content[columnIdx];

  const messages = useMessages(messageIds);
  const recipient = calls[0].recipient;
  const model = useModel((env) => new CallModel(env, orgId));

  //  const viewModel = useModel((env) => new ViewModel(env, orgId, viewId));
  //const updatedCalls = model.getUpdatedCalls(calls);

  //  const sorted = useMemo(() => {
  // Replace any calls from view with updated calls where they exist
  /*
    const callList = [];
    for (const call of calls) {
      const updatedCall = updatedCalls.find((uc) => uc.data?.id == call.id);
      if (updatedCall?.data) {
        // A quirk of the API is that calls are returned with call.caller.name,
        // get the first_name and last_name from the calls provided by the view.
        const transformedUpdatedCall = {
          ...updatedCall,
          caller: {
            first_name: call.caller.first_name,
            last_name: call.caller.last_name,
          },
        };

        callList.push(transformedUpdatedCall.data as Call);
      } else {
        callList.push(call);
      }
    }*/

  // Sort first according to date ascending, then organizer action needed first
  const sorted = [...calls]
    .sort((call0, call1) => {
      const d0 = new Date(call0?.update_time || 0);
      const d1 = new Date(call1?.update_time || 0);
      return d1.getTime() - d0.getTime();
    })
    .sort((call0, call1) => {
      if (!call0?.organizer_action_taken && !!call1?.organizer_action_taken) {
        return -1;
      } else if (
        !!call0?.organizer_action_taken &&
        !call1?.organizer_action_taken
      ) {
        return 1;
      } else {
        return 0;
      }
    });

  return (
    <>
      <PaneHeader
        subtitle={
          <Msg
            id={messageIds.organizerActionPane.subtitle}
            values={{ person: <ZUIPersonLink person={recipient} /> }}
          />
        }
        title={messages.organizerActionPane.title()}
      />
      {sorted.map((call) => (
        <Box key={call?.id}>
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
          <Typography>{call?.message_to_organizer}</Typography>
          {!call?.organizer_action_taken ? (
            <Button
              onClick={() => call && model.setOrganizerActionTaken(call.id)}
              variant="contained"
            >
              <Check />
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
