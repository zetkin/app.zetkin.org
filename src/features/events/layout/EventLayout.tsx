import { Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { FormattedDate } from 'react-intl';
import PeopleIcon from '@mui/icons-material/People';
import TabbedLayout from 'utils/layout/TabbedLayout';

import EventDataModel from '../models/EventDataModel';
import EventStatusChip from '../components/EventStatusChip';
import EventTypesModel from '../models/EventTypesModel';
import messageIds from '../l10n/messageIds';
import useModel from 'core/useModel';
import ZUIAutocompleteInPlaceTest from 'zui/ZUIAutocompleteInPlaceTest';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import { Msg, useMessages } from 'core/i18n';

interface EventLayoutProps {
  children: React.ReactNode;
  eventId: string;
  orgId: string;
  campaignId: string;
}

const EventLayout: React.FC<EventLayoutProps> = ({
  children,
  eventId,
  orgId,
  campaignId,
}) => {
  const messages = useMessages(messageIds);

  const model = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  const typesModel = useModel(
    (env) => new EventTypesModel(env, parseInt(orgId))
  );

  const showTimeOnly = (value: Date) => {
    return value.toLocaleTimeString('en-Us', {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      timeZone: 'UTC',
    });
  };

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/${campaignId}/events/${eventId}`}
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <EventStatusChip state={model.state} />
          </Box>
          <ZUIFutures
            futures={{
              currentEvent: model.getData(),
              types: typesModel.getTypes(),
            }}
          >
            {({ data: { types, currentEvent } }) => {
              return (
                // <ZUIAutocompleteInPlace
                //   currentType={currentType}
                //   types={eventTypes}
                // />
                <ZUIAutocompleteInPlaceTest
                  currentType={currentEvent.activity}
                  types={types}
                />
              );
            }}
          </ZUIFutures>
          <Box marginX={2}>
            <ZUIFuture future={model.getData()}>
              {(data) => {
                const startDate = new Date(data.start_time);
                const startTime = showTimeOnly(startDate);

                const endDate = new Date(data.end_time);
                const endTime = showTimeOnly(endDate);

                const isToday =
                  startDate.toDateString() === new Date().toDateString();
                const endsOnSameDay =
                  startDate.toDateString() === endDate.toDateString();
                const endsOnToday =
                  endDate.toDateString() === new Date().toDateString();

                const labels: ZUIIconLabelProps[] = [];

                if (startDate && endDate) {
                  labels.push({
                    icon: <EventIcon />,
                    label: (
                      <>
                        {isToday && (
                          <>
                            {endsOnSameDay && (
                              <Msg
                                id={messageIds.stats.singleDayToday}
                                values={{ end: endTime, start: startTime }}
                              />
                            )}
                            {!endsOnSameDay && (
                              <Msg
                                id={messageIds.stats.multiDayToday}
                                values={{
                                  end: endTime,
                                  endDate: (
                                    <FormattedDate
                                      day="numeric"
                                      month="long"
                                      value={data.end_time}
                                    />
                                  ),
                                  start: startTime,
                                }}
                              />
                            )}
                          </>
                        )}
                        {!isToday && (
                          <>
                            {endsOnSameDay && (
                              <Msg
                                id={messageIds.stats.singleDay}
                                values={{
                                  date: (
                                    <FormattedDate
                                      day="numeric"
                                      month="long"
                                      value={data.start_time}
                                    />
                                  ),
                                  end: endTime,
                                  start: startTime,
                                }}
                              />
                            )}
                            {!endsOnSameDay && (
                              <>
                                {endsOnToday && (
                                  <Msg
                                    id={messageIds.stats.multiDayEndsToday}
                                    values={{
                                      end: endTime,
                                      start: startTime,
                                      startDate: (
                                        <FormattedDate
                                          day="numeric"
                                          month="long"
                                          value={data.start_time}
                                        />
                                      ),
                                    }}
                                  />
                                )}
                                {!endsOnToday && (
                                  <Msg
                                    id={messageIds.stats.multiDay}
                                    values={{
                                      end: endTime,
                                      endDate: (
                                        <FormattedDate
                                          day="numeric"
                                          month="long"
                                          value={data.end_time}
                                        />
                                      ),
                                      start: startTime,
                                      startDate: (
                                        <FormattedDate
                                          day="numeric"
                                          month="long"
                                          value={data.start_time}
                                        />
                                      ),
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    ),
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
        <ZUIFuture future={model.getData()}>
          {(data) => {
            return (
              <ZUIEditTextinPlace
                onChange={(val) => {
                  model.setTitle(val);
                }}
                value={data.title || data.activity.title}
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
