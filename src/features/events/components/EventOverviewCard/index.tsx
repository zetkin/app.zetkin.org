import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import { FormattedTime } from 'react-intl';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { TimeField } from '@mui/x-date-pickers-pro';
import utc from 'dayjs/plugin/utc';
import { AccessTime, Add } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  ClickAwayListener,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';

import { getWorkingUrl } from 'features/events/utils/getWorkingUrl';
import LocationModal from '../LocationModal';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import useEventLocationMutations from 'features/events/hooks/useEventLocationMutations';
import useEventLocations from 'features/events/hooks/useEventLocations';
import useEventMutations from 'features/events/hooks/useEventMutations';
import { useMessages } from 'core/i18n';
import useParallelEvents from 'features/events/hooks/useParallelEvents';
import ZUIDate from 'zui/ZUIDate';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';
import {
  isSameDate,
  makeNaiveDateString,
  makeNaiveTimeString,
  removeOffset,
} from 'utils/dateUtils';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';

dayjs.extend(utc);

type EventOverviewCardProps = {
  data: ZetkinEvent;
  orgId: number;
};

const EventOverviewCard: FC<EventOverviewCardProps> = ({ data, orgId }) => {
  const { updateEvent } = useEventMutations(orgId, data.id);
  const locations = useEventLocations(orgId);
  const { addLocation } = useEventLocationMutations(orgId);
  const messages = useMessages(messageIds);
  const [editable, setEditable] = useState(false);
  const [link, setLink] = useState(data.url);
  const [infoText, setInfoText] = useState(data.info_text);
  const [locationId, setLocationId] = useState<number | null>(
    data.location?.id ?? null
  );
  const [startDate, setStartDate] = useState(data.start_time.slice(0, 10));
  const [endDate, setEndDate] = useState(data.end_time.slice(0, 10));
  const [startTime, setStartTime] = useState(
    removeOffset(data.start_time.slice(11, 16))
  );
  const [endTime, setEndTime] = useState(
    removeOffset(data.end_time.slice(11, 16))
  );
  const naiveEnd = `${endDate}T${endTime}`;
  const naiveStart = `${startDate}T${startTime}`;

  const [wantsToShowEndDate, setWantsToShowEndDate] = useState(false);
  const mustShowEndDate = dayjs(endDate).isAfter(dayjs(startDate), 'day');

  const showEndDate = mustShowEndDate || wantsToShowEndDate;
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter: () => setEditable(true),
      onEditModeExit: () => {
        setEditable(false);
        setWantsToShowEndDate(false);
      },
      save: () => {
        updateEvent({
          end_time: `${naiveEnd}:00`,
          info_text: infoText,
          location_id: locationId,
          start_time: `${naiveStart}:00`,
          url: link,
        });
      },
    });

  const sortedLocation = useMemo(() => {
    const sorted = locations?.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [locations?.length]);

  const options: (
    | ZetkinLocation
    | 'CREATE_NEW_LOCATION'
    | 'NO_PHYSICAL_LOCATION'
  )[] = sortedLocation
    ? [...sortedLocation, 'NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION']
    : ['NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION'];

  const events = useParallelEvents(orgId, data.start_time, data.end_time);

  return (
    <ClickAwayListener {...clickAwayProps}>
      <Box {...containerProps}>
        <Card>
          {!editable && (
            <Box display="flex" justifyContent="flex-end" m={2}>
              <Button startIcon={<EditIcon />} variant="outlined">
                {messages.eventOverviewCard.editButton().toUpperCase()}
              </Button>
            </Box>
          )}
          <Box display="flex" marginTop={12} padding={2}>
            <Box display="flex" flex={1} gap={1}>
              <Box flex={1}>
                <ZUIPreviewableInput
                  {...previewableProps}
                  renderInput={(params) => {
                    params.ref;
                    return (
                      <DatePicker
                        format="DD-MM-YYYY"
                        inputRef={params.ref}
                        label={messages.eventOverviewCard.startDate()}
                        onChange={(newStartDate) => {
                          if (newStartDate) {
                            const startDateString = makeNaiveDateString(
                              newStartDate.utc().toDate()
                            );
                            setStartDate(startDateString);
                            if (newStartDate > dayjs(endDate)) {
                              setEndDate(startDateString);
                            }
                          }
                        }}
                        sx={{ marginBottom: 2 }}
                        value={dayjs(startDate)}
                      />
                    );
                  }}
                  renderPreview={() => {
                    return (
                      <Box>
                        <Typography color="secondary" variant="subtitle1">
                          {messages.eventOverviewCard.startDate().toUpperCase()}
                        </Typography>
                        <ZUIDate datetime={startDate} />
                      </Box>
                    );
                  }}
                  value={startDate}
                />
                <ZUIPreviewableInput
                  {...previewableProps}
                  renderInput={(params) => {
                    return (
                      <TimeField
                        ampm={false}
                        format="HH:mm"
                        fullWidth
                        inputRef={params.ref}
                        label={messages.eventOverviewCard.startTime()}
                        onChange={(newStartTime) => {
                          if (newStartTime) {
                            const startTimeString = makeNaiveTimeString(
                              newStartTime.utc().toDate()
                            );
                            setStartTime(startTimeString);
                          }
                        }}
                        slotProps={{
                          textField: {
                            InputProps: {
                              endAdornment: <AccessTime color="secondary" />,
                            },
                          },
                        }}
                        value={dayjs(naiveStart)}
                      />
                    );
                  }}
                  renderPreview={() => {
                    return <FormattedTime hour12={false} value={naiveStart} />;
                  }}
                  value={naiveStart}
                />
              </Box>
              <Box
                display="flex"
                flex={1}
                flexDirection="column"
                justifyContent={!showEndDate && editable ? 'space-between' : ''}
              >
                <ZUIPreviewableInput
                  {...previewableProps}
                  renderInput={(params) => {
                    return (
                      <>
                        {!showEndDate && (
                          <Box paddingTop={2}>
                            <Button
                              onClick={() => {
                                setWantsToShowEndDate(true);
                              }}
                              variant="text"
                            >
                              {messages.eventOverviewCard.buttonEndDate()}
                            </Button>
                          </Box>
                        )}
                        {showEndDate && (
                          <DatePicker
                            format="DD-MM-YYYY"
                            inputRef={params.ref}
                            label={messages.eventOverviewCard.endDate()}
                            minDate={dayjs(startDate)}
                            onChange={(newEndDate) => {
                              if (newEndDate) {
                                const endDateString = makeNaiveDateString(
                                  newEndDate.utc().toDate()
                                );
                                setEndDate(endDateString);
                                if (
                                  isSameDate(
                                    new Date(endDateString),
                                    new Date(startDate)
                                  )
                                ) {
                                  setWantsToShowEndDate(false);
                                }
                              }
                            }}
                            sx={{ marginBottom: 2 }}
                            value={dayjs(naiveEnd)}
                          />
                        )}
                      </>
                    );
                  }}
                  renderPreview={() => (
                    <Box marginBottom={showEndDate ? '' : 3}>
                      <Typography color="secondary" variant="subtitle1">
                        {messages.eventOverviewCard.endDate().toUpperCase()}
                      </Typography>
                      {showEndDate && <ZUIDate datetime={naiveEnd} />}
                    </Box>
                  )}
                  value={naiveEnd}
                />
                <ZUIPreviewableInput
                  {...previewableProps}
                  renderInput={(params) => {
                    return (
                      <TimeField
                        ampm={false}
                        disableIgnoringDatePartForTimeValidation={true}
                        format="HH:mm"
                        fullWidth
                        inputRef={params.ref}
                        label={messages.eventOverviewCard.endTime()}
                        minTime={dayjs(naiveStart).add(1, 'min')}
                        onChange={(newEndTime) => {
                          if (newEndTime) {
                            if (newEndTime >= dayjs(naiveStart).add(1, 'min')) {
                              const endTimeString = makeNaiveTimeString(
                                newEndTime.utc().toDate()
                              );
                              setEndTime(endTimeString);
                            }
                          }
                        }}
                        slotProps={{
                          textField: {
                            InputProps: {
                              endAdornment: <AccessTime color="secondary" />,
                              fullWidth: true,
                            },
                          },
                        }}
                        value={dayjs(naiveEnd)}
                      />
                    );
                  }}
                  renderPreview={() => {
                    return <FormattedTime hour12={false} value={naiveEnd} />;
                  }}
                  value={naiveEnd}
                />
              </Box>
            </Box>
            <Divider
              flexItem
              orientation="vertical"
              sx={{ marginX: editable ? 1 : '' }}
            />
            <Box display="flex" flex={1} flexDirection="column" gap={2}>
              <ZUIPreviewableInput
                {...previewableProps}
                renderInput={() => {
                  return (
                    <Box alignItems="center" display="flex">
                      <Autocomplete
                        disableClearable
                        fullWidth
                        getOptionLabel={(option) =>
                          option === 'CREATE_NEW_LOCATION'
                            ? messages.eventOverviewCard.createLocation()
                            : option === 'NO_PHYSICAL_LOCATION'
                            ? messages.eventOverviewCard.noLocation()
                            : option.title
                        }
                        onChange={(ev, option) => {
                          if (option === 'CREATE_NEW_LOCATION') {
                            setLocationModalOpen(true);
                            return;
                          }
                          if (option === 'NO_PHYSICAL_LOCATION') {
                            setLocationId(null);
                            return;
                          }
                          const location = locations?.find(
                            (location) => location.id === option.id
                          );
                          if (!location) {
                            return;
                          }
                          setLocationId(location.id);
                        }}
                        options={options}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={messages.eventOverviewCard.location()}
                            sx={{
                              backgroundColor: 'white',
                              borderRadius: '5px',
                            }}
                          />
                        )}
                        renderOption={(params, option) =>
                          option === 'CREATE_NEW_LOCATION' ? (
                            <li {...params}>
                              <Add sx={{ marginRight: 2 }} />
                              {messages.eventOverviewCard.createLocation()}
                            </li>
                          ) : option === 'NO_PHYSICAL_LOCATION' ? (
                            <li {...params}>
                              {messages.eventOverviewCard.noLocation()}
                            </li>
                          ) : (
                            <li {...params}>{option.title}</li>
                          )
                        }
                        value={
                          locationId === null
                            ? 'NO_PHYSICAL_LOCATION'
                            : options?.find(
                                (location) =>
                                  location !== 'CREATE_NEW_LOCATION' &&
                                  location !== 'NO_PHYSICAL_LOCATION' &&
                                  location.id === locationId
                              )
                        }
                      />
                      <MapIcon
                        color="secondary"
                        onClick={() => setLocationModalOpen(true)}
                        sx={{ cursor: 'pointer', marginLeft: 1 }}
                      />
                      <LocationModal
                        currentEvent={data}
                        events={events || []}
                        locationId={locationId}
                        locations={locations || []}
                        onCreateLocation={(
                          newLocation: Partial<ZetkinLocation>
                        ) => {
                          addLocation(newLocation);
                        }}
                        onMapClose={() => {
                          setLocationModalOpen(false);
                        }}
                        onSelectLocation={(location: ZetkinLocation) =>
                          setLocationId(location.id)
                        }
                        open={locationModalOpen}
                      />
                    </Box>
                  );
                }}
                renderPreview={() => {
                  if (data.location) {
                    return (
                      <Box marginLeft={4}>
                        <Typography color="secondary" variant="subtitle1">
                          {messages.eventOverviewCard.location().toUpperCase()}
                        </Typography>
                        <Typography variant="body1">
                          {data.location.title}
                        </Typography>
                      </Box>
                    );
                  } else {
                    return (
                      <Box marginLeft={4}>
                        <Typography color="secondary" variant="subtitle1">
                          {messages.eventOverviewCard.location().toUpperCase()}
                        </Typography>
                        <Typography variant="body1">
                          {messages.eventOverviewCard.noLocation()}
                        </Typography>
                      </Box>
                    );
                  }
                }}
                value={locationId ?? ''}
              />
              <ZUIPreviewableInput
                {...previewableProps}
                renderInput={(props) => (
                  <TextField
                    fullWidth
                    inputProps={props}
                    label={messages.eventOverviewCard.url()}
                    onChange={(ev) => setLink(ev.target.value)}
                    value={link}
                  />
                )}
                {...(data.url &&
                  data.url !== '' && {
                    renderPreview: () => (
                      <Box marginLeft={4}>
                        <Typography
                          color={theme.palette.text.secondary}
                          variant="subtitle1"
                        >
                          {messages.eventOverviewCard.url().toUpperCase()}
                        </Typography>
                        <Typography
                          sx={{
                            alignItems: 'flex-start',
                            display: 'flex',
                          }}
                          variant="body1"
                        >
                          {data.url}
                          <Link
                            //TS won't infer type here for some reason
                            href={getWorkingUrl(data.url as string)}
                            target="_blank"
                          >
                            <Box marginLeft={1}>
                              <OpenInNewIcon color="primary" />
                            </Box>
                          </Link>
                        </Typography>
                      </Box>
                    ),
                  })}
                value={link || ''}
              />
            </Box>
          </Box>
          <Box p={2}>
            <ZUIPreviewableInput
              {...previewableProps}
              renderInput={(props) => (
                <TextField
                  fullWidth
                  inputProps={props}
                  label={messages.eventOverviewCard.description()}
                  multiline
                  onChange={(ev) => setInfoText(ev.target.value)}
                  rows={4}
                  value={infoText}
                />
              )}
              {...(data.info_text !== '' && {
                renderPreview: () => (
                  <Box>
                    <Typography
                      color={theme.palette.text.secondary}
                      variant="subtitle1"
                    >
                      {messages.eventOverviewCard.description().toUpperCase()}
                    </Typography>
                    <Typography variant="body1">{data.info_text}</Typography>
                  </Box>
                ),
              })}
              value={infoText}
            />
          </Box>
        </Card>
      </Box>
    </ClickAwayListener>
  );
};

export default EventOverviewCard;
