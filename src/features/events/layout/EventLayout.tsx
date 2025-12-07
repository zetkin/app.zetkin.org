import { Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import Head from 'next/head';
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
  const event = useEvent(parseInt(orgId), parseInt(eventId));
  const eventState = useEventState(parseInt(orgId), parseInt(eventId));
  const { setTitle, setType } = useEventMutations(
    parseInt(orgId),
    parseInt(eventId)
  );

  const eventTypes = useEventTypes(parseInt(orgId));

  if (!event) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {event.title || event.activity?.title || messages.common.noTitle()}
        </title>
      </Head>
      <TabbedLayout
        actionButtons={<EventActionButtons event={event} />}
        baseHref={getEventUrl(event)}
        defaultTab="/"
        subtitle={
          <Box alignItems="center" display="flex">
            <Box marginRight={1}>
              <EventStatusChip state={eventState} />
            </Box>
            <ZUIFutures
              futures={{
                types: eventTypes,
              }}
            >
              {({ data: { types } }) => {
                return (
                  <EventTypeAutocomplete
                    onBlur={() => setEditingTypeOrTitle(false)}
                    onChange={(newValue) => {
                      setType(newValue ? newValue.id : newValue);
                      setEditingTypeOrTitle(false);
                    }}
                    onChangeNewOption={(newValueId) => setType(newValueId)}
                    onFocus={() => setEditingTypeOrTitle(true)}
                    orgId={event.organization.id}
                    showBorder={editingTypeOrTitle}
                    types={types}
                    value={event.activity}
                  />
                );
              }}
            </ZUIFutures>
            <Box marginX={1}>
              {(() => {
                const startDate = new Date(removeOffset(event.start_time));
                const endDate = new Date(removeOffset(event.end_time));

                const labels: ZUIIconLabelProps[] = [];

                if (startDate && endDate) {
                  labels.push({
                    icon: <EventIcon />,
                    label: <ZUITimeSpan end={endDate} start={startDate} />,
                  });
                  if (event.num_participants_available) {
                    labels.push({
                      icon: <PeopleIcon />,
                      label: (
                        <Msg
                          id={messageIds.stats.participants}
                          values={{
                            participants: event.num_participants_available,
                          }}
                        />
                      ),
                    });
                  }
                }
                return <ZUIIconLabelRow iconLabels={labels} />;
              })()}
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
              event.title || event.activity?.title || messages.common.noTitle()
            }
            showBorder={editingTypeOrTitle}
            tooltipContent={messages.tooltipContent()}
            value={event.title || ''}
          />
        }
      >
        {children}
      </TabbedLayout>
    </>
  );
};

export default EventLayout;
