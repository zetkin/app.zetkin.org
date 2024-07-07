import { Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import { useState } from 'react';

import TabbedLayout from 'utils/layout/TabbedLayout';
import EventActionButtons from '../components/EventActionButtons';
import EventStatusChip from '../components/EventStatusChip';
import EventTypeAutocomplete from '../components/EventTypeAutocomplete';
import getEventUrl from '../utils/getEventUrl';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import useEvent from '../hooks/useEvent';
import useEventMutations from '../hooks/useEventMutations';
import useEventState from '../hooks/useEventState';
import useEventTypes from '../hooks/useEventTypes';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { Msg, useMessages } from 'core/i18n';

interface EventLayoutProps {
  children: React.ReactNode;
  eventId: string;
  orgId: string;
}

const EventLayout: React.FC<EventLayoutProps> = ({
  children,
  eventId,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const [editingTypeOrTitle, setEditingTypeOrTitle] = useState(false);
  const eventFuture = useEvent(parseInt(orgId), parseInt(eventId));
  const eventState = useEventState(parseInt(orgId), parseInt(eventId));
  const { setTitle, setType } = useEventMutations(
    parseInt(orgId),
    parseInt(eventId)
  );

  const eventTypes = useEventTypes(parseInt(orgId));

  if (!eventFuture) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={
        <ZUIFuture future={eventFuture}>
          {(data) => {
            return <EventActionButtons event={data} />;
          }}
        </ZUIFuture>
      }
      baseHref={getEventUrl(eventFuture.data)}
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <EventStatusChip state={eventState} />
          </Box>
          <ZUIFutures
            futures={{
              currentEvent: eventFuture,
              types: eventTypes,
            }}
          >
            {({ data: { types, currentEvent } }) => {
              return (
                <EventTypeAutocomplete
                  onBlur={() => setEditingTypeOrTitle(false)}
                  onChange={(newValue) => {
                    setType(newValue ? newValue.id : newValue);
                    setEditingTypeOrTitle(false);
                  }}
                  onChangeNewOption={(newValueId) => setType(newValueId)}
                  onFocus={() => setEditingTypeOrTitle(true)}
                  orgId={currentEvent.organization.id}
                  showBorder={editingTypeOrTitle}
                  types={types}
                  value={currentEvent.activity}
                />
              );
            }}
          </ZUIFutures>
          <Box marginX={1}>
            <ZUIFuture future={eventFuture}>
              {(data) => {
                const startDate = new Date(removeOffset(data.start_time));
                const endDate = new Date(removeOffset(data.end_time));

                const labels: ZUIIconLabelProps[] = [];

                if (startDate && endDate) {
                  labels.push({
                    icon: <EventIcon />,
                    label: <ZUITimeSpan end={endDate} start={startDate} />,
                  });
                  if (data.num_participants_available) {
                    labels.push({
                      icon: <PeopleIcon />,
                      label: (
                        <Msg
                          id={messageIds.stats.participants}
                          values={{
                            participants: data.num_participants_available,
                          }}
                        />
                      ),
                    });
                  }
                }
                return <ZUIIconLabelRow iconLabels={labels} />;
              }}
            </ZUIFuture>
          </Box>
        </Box>
      }
      tabs={[
        { href: '/', label: messages.tabs.overview() },
        {
          href: '/participants',
          label: messages.tabs.participants(),
        },
      ]}
      title={
        <ZUIFuture future={eventFuture}>
          {(data) => {
            return (
              <ZUIEditTextinPlace
                allowEmpty={true}
                onBlur={() => {
                  setEditingTypeOrTitle(false);
                }}
                onChange={(val) => {
                  setEditingTypeOrTitle(false);
                  setTitle(val);
                }}
                onFocus={() => setEditingTypeOrTitle(true)}
                placeholder={
                  data.title ||
                  data.activity?.title ||
                  messages.common.noTitle()
                }
                showBorder={editingTypeOrTitle}
                tooltipContent={messages.tooltipContent()}
                value={data.title || ''}
              />
            );
          }}
        </ZUIFuture>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default EventLayout;
