import { Add } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import { FormattedTime } from 'react-intl';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  ClickAwayListener,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useState } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import { EventsModel } from 'features/events/models/EventsModel';
import { getWorkingUrl } from 'features/events/utils/getWorkingUrl';
import LocationModal from '../LocationModal';
import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import ZUIDate from 'zui/ZUIDate';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';
import {
  dateIsBefore,
  isSameDate,
  isValidDate,
  removeOffset,
} from 'utils/dateUtils';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';

type EventOverviewCardProps = {
  data: ZetkinEvent;
  dataModel: EventDataModel;
  eventsModel: EventsModel;
  locationsModel: LocationsModel;
};

const EventOverviewCard: FC<EventOverviewCardProps> = ({
  data,
  dataModel,
  eventsModel,
  locationsModel,
}) => {
  const locations = locationsModel.getLocations().data;
  const messages = useMessages(messageIds);
  const [editable, setEditable] = useState(false);
  const [link, setLink] = useState(data.url);
  const [infoText, setInfoText] = useState(data.info_text);
  const [locationId, setLocationId] = useState<number | null>(
    data.location?.id ?? null
  );

  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs(removeOffset(data.start_time))
  );
  const [endDate, setEndDate] = useState<Dayjs>(
    dayjs(removeOffset(data.end_time))
  );
  const [showEndDate, setShowEndDate] = useState(false);
  const [invalidFormat, setInvalidFormat] = useState(false);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter: () => setEditable(true),
      onEditModeExit: () => {
        setEditable(false);
        setShowEndDate(false);
      },
      save: () => {
        dataModel.updateEventData({
          end_time: dayjs(endDate)
            .hour(endDate.hour())
            .minute(endDate.minute())
            .format(),
          info_text: infoText,
          location_id: locationId,
          start_time: dayjs(startDate)
            .hour(startDate.hour())
            .minute(startDate.minute())
            .format(),

          url: link,
        });
      },
    });

  const options: (
    | ZetkinLocation
    | 'CREATE_NEW_LOCATION'
    | 'NO_PHYSICAL_LOCATION'
  )[] = locations
    ? [...locations, 'NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION']
    : ['NO_PHYSICAL_LOCATION', 'CREATE_NEW_LOCATION'];

  const events = eventsModel.getParallelEvents(
    data.start_time,
    data.end_time
  ).data;

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
          <Grid container sx={{ marginTop: '100px' }}>
            <Grid container m={2} sm xs={8}>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
                xs
              >
                <Grid item sx={{ alignItems: 'center' }}>
                  <ZUIPreviewableInput
                    {...previewableProps}
                    renderInput={(props) => {
                      return (
                        <DatePicker
                          inputFormat="DD-MM-YYYY"
                          label={messages.eventOverviewCard.startDate()}
                          onChange={(newValue) => {
                            if (newValue && isValidDate(newValue.toDate())) {
                              setInvalidFormat(false);
                              setStartDate(dayjs(newValue));
                              if (
                                dateIsBefore(
                                  newValue.toDate(),
                                  endDate.toDate()
                                )
                              ) {
                                setEndDate(newValue);
                              }
                            }
                          }}
                          renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                error={invalidFormat}
                                inputProps={{
                                  ...params.inputProps,
                                  ...props,
                                }}
                                sx={{ marginBottom: '15px' }}
                              />
                            );
                          }}
                          value={dayjs(startDate)}
                        />
                      );
                    }}
                    renderPreview={() => {
                      return (
                        <Box>
                          <Typography color="secondary" variant="subtitle1">
                            {messages.eventOverviewCard
                              .startDate()
                              .toUpperCase()}
                          </Typography>
                          <ZUIDate
                            datetime={new Date(
                              dayjs(startDate).format()
                            ).toISOString()}
                          />
                        </Box>
                      );
                    }}
                    value={dayjs(startDate).format()}
                  />
                  <ZUIPreviewableInput
                    {...previewableProps}
                    renderInput={(props) => {
                      return (
                        <TimePicker
                          ampm={false}
                          inputFormat="HH:mm"
                          label={messages.eventOverviewCard.startTime()}
                          onChange={(newValue) => {
                            if (newValue && isValidDate(newValue.toDate())) {
                              if (dayjs(newValue) < dayjs(endDate)) {
                                setInvalidFormat(false);
                                setStartDate(dayjs(newValue));
                              }
                            }
                          }}
                          open={false}
                          renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  ...props,
                                }}
                                sx={{ button: { cursor: 'text' } }}
                              />
                            );
                          }}
                          value={dayjs(startDate)}
                        />
                      );
                    }}
                    renderPreview={() => {
                      return (
                        <Box>
                          <FormattedTime
                            hour12={false}
                            value={startDate.format()}
                          />
                        </Box>
                      );
                    }}
                    value={dayjs(startDate).format()}
                  />
                </Grid>
                <Grid id={'wrap'} ml={1} sx={{ alignItems: 'center' }}>
                  <ZUIPreviewableInput
                    {...previewableProps}
                    renderInput={(props) => {
                      return (
                        <DatePicker
                          inputFormat="DD-MM-YYYY"
                          label={messages.eventOverviewCard.endDate()}
                          onChange={(newValue) => {
                            if (newValue && isValidDate(newValue.toDate())) {
                              if (
                                newValue &&
                                dateIsBefore(
                                  startDate.toDate(),
                                  newValue.toDate()
                                )
                              ) {
                                setInvalidFormat(false);
                                setStartDate(newValue);
                                setEndDate(newValue);
                              } else {
                                setInvalidFormat(false);
                                setEndDate(newValue);
                              }
                            }
                          }}
                          renderInput={(params) => {
                            if (
                              !isSameDate(
                                startDate.toDate(),
                                endDate.toDate()
                              ) ||
                              showEndDate
                            ) {
                              return (
                                <TextField
                                  {...params}
                                  error={invalidFormat}
                                  inputProps={{
                                    ...params.inputProps,
                                    ...props,
                                  }}
                                  sx={{ marginBottom: '15px' }}
                                />
                              );
                            } else {
                              return (
                                <Grid container xs={6}>
                                  <Grid item mt={2}>
                                    <Button
                                      onClick={() => {
                                        setShowEndDate(true);
                                      }}
                                      sx={{
                                        marginBottom: '19px',
                                        width: 'max-content',
                                      }}
                                      variant="text"
                                    >
                                      {messages.eventOverviewCard.buttonEndDate()}
                                    </Button>
                                  </Grid>
                                </Grid>
                              );
                            }
                          }}
                          value={dayjs(endDate)}
                        />
                      );
                    }}
                    renderPreview={() => {
                      if (!isSameDate(startDate.toDate(), endDate.toDate())) {
                        return (
                          <Box ml={10}>
                            <Typography color="secondary" variant="subtitle1">
                              {messages.eventOverviewCard
                                .endDate()
                                .toUpperCase()}
                            </Typography>
                            <ZUIDate
                              datetime={new Date(
                                dayjs(endDate).format()
                              ).toISOString()}
                            />
                          </Box>
                        );
                      } else {
                        return (
                          <Box ml={10}>
                            <Typography color="secondary" variant="subtitle1">
                              {messages.eventOverviewCard
                                .endDate()
                                .toUpperCase()}
                            </Typography>
                            <Box mb={3} />
                          </Box>
                        );
                      }
                    }}
                    value={dayjs(endDate).format()}
                  />
                  <ZUIPreviewableInput
                    {...previewableProps}
                    renderInput={(props) => {
                      return (
                        <TimePicker
                          ampm={false}
                          inputFormat="HH:mm"
                          label={messages.eventOverviewCard.endTime()}
                          onChange={(newValue) => {
                            if (newValue && isValidDate(newValue.toDate())) {
                              if (dayjs(newValue) > dayjs(startDate)) {
                                setInvalidFormat(false);
                                setEndDate(newValue);
                              }
                            }
                          }}
                          open={false}
                          renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                error={invalidFormat}
                                inputProps={{
                                  ...params.inputProps,
                                  ...props,
                                }}
                                sx={{ button: { cursor: 'text' } }}
                              />
                            );
                          }}
                          value={dayjs(endDate)}
                        />
                      );
                    }}
                    renderPreview={() => {
                      return (
                        <Box ml={10}>
                          <FormattedTime
                            hour12={false}
                            value={new Date(
                              dayjs(endDate).format()
                            ).toISOString()}
                          />
                        </Box>
                      );
                    }}
                    value={dayjs(endDate).format()}
                  />
                </Grid>
              </Grid>
              <Divider
                flexItem
                orientation="vertical"
                sx={{ marginBottom: '10px', marginLeft: '10px' }}
              />
              <Grid sx={{ marginLeft: '10px' }} xs>
                <Grid item sx={{ alignItems: 'center' }}>
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
                            currentEventId={data.id}
                            events={events || []}
                            locationId={locationId}
                            locations={locations || []}
                            model={locationsModel}
                            onCreateLocation={(
                              newLocation: Partial<ZetkinLocation>
                            ) => {
                              locationsModel.addLocation(newLocation);
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
                          <Box ml={4}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography color="secondary" variant="subtitle1">
                                {messages.eventOverviewCard
                                  .location()
                                  .toUpperCase()}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                alignItems: 'flex-start',
                                display: 'flex',
                              }}
                              variant="body1"
                            >
                              {data.location.title}
                            </Typography>
                          </Box>
                        );
                      } else {
                        return (
                          <Box ml={4}>
                            <Typography color="secondary" variant="subtitle1">
                              {messages.eventOverviewCard
                                .location()
                                .toUpperCase()}
                            </Typography>
                            <Typography
                              sx={{
                                alignItems: 'flex-start',
                                display: 'flex',
                              }}
                              variant="body1"
                            >
                              {messages.eventOverviewCard.noLocation()}
                            </Typography>
                          </Box>
                        );
                      }
                    }}
                    value={locationId ?? ''}
                  />
                </Grid>
                <Grid item mt={2}>
                  <ZUIPreviewableInput
                    {...previewableProps}
                    renderInput={(props) => (
                      <TextField
                        fullWidth
                        inputProps={props}
                        label={messages.eventOverviewCard.url()}
                        onChange={(ev) => setLink(ev.target.value)}
                        sx={{ marginBottom: 2 }}
                        value={link}
                      />
                    )}
                    renderPreview={() => {
                      if (data.url && data.url !== '') {
                        return (
                          <Box ml={4}>
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
                                href={getWorkingUrl(data.url)}
                                sx={{ marginLeft: '8px' }}
                                target="_blank"
                              >
                                <OpenInNewIcon color="primary" />
                              </Link>
                            </Typography>
                          </Box>
                        );
                      } else {
                        return <></>;
                      }
                    }}
                    value={link || ''}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
              renderPreview={() => {
                if (data.info_text !== '') {
                  return (
                    <Box>
                      <Typography
                        color={theme.palette.text.secondary}
                        variant="subtitle1"
                      >
                        {messages.eventOverviewCard.description().toUpperCase()}
                      </Typography>
                      <Typography variant="body1">{data.info_text}</Typography>
                    </Box>
                  );
                } else {
                  return <></>;
                }
              }}
              value={infoText}
            />
          </Box>
        </Card>
      </Box>
    </ClickAwayListener>
  );
};

export default EventOverviewCard;
