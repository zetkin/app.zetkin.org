import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import { FormattedTime } from 'react-intl';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Add, Place } from '@mui/icons-material';
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
import dayjs, { Dayjs } from 'dayjs';
import { FC, useState } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import { getWorkingUrl } from 'features/events/utils/getWorkingUrl';
import LocationModal from '../LocationModal';
import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import ZUIDate from 'zui/ZUIDate';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';
import {
  endDateIsBeforeStartDate,
  isSameDate,
  isSameTime,
  removeOffset,
} from 'utils/dateUtils';

type EventOverviewCardProps = {
  dataModel: EventDataModel;
  locationsModel: LocationsModel;
};

const EventOverviewCard: FC<EventOverviewCardProps> = ({
  dataModel,
  locationsModel,
}) => {
  const eventData = dataModel.getData().data;
  const locations = locationsModel.getLocations().data;
  const messages = useMessages(messageIds);
  const [editable, setEditable] = useState(false);
  const [link, setLink] = useState(eventData?.url ?? '');
  const [infoText, setInfoText] = useState(eventData?.info_text ?? '');
  const [locationId, setLocationId] = useState(
    eventData?.location.id ?? undefined
  );

  const [startDate, setStartDate] = useState<Dayjs | undefined>(
    eventData?.start_time
      ? dayjs(removeOffset(eventData.start_time))
      : undefined
  );
  const [endDate, setEndDate] = useState<Dayjs | undefined>(
    eventData?.end_time ? dayjs(removeOffset(eventData.end_time)) : undefined
  );

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter: () => setEditable(true),
      onEditModeExit: () => setEditable(false),
      save: () => {
        dataModel.updateEventData({
          end_time: dayjs(endDate)
            .hour(endDate ? endDate.hour() : 0)
            .minute(endDate ? endDate.minute() : 0)
            .format(),
          info_text: infoText,
          location_id: locationId,
          start_time: dayjs(startDate)
            .hour(startDate ? startDate.hour() : 0)
            .minute(startDate ? startDate.minute() : 0)
            .format(),

          url: link,
        });
      },
    });

  if (!eventData) {
    return null;
  }

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
          <Box>
            <Box m={2}>
              <ZUIPreviewableInput
                {...previewableProps}
                renderInput={(props) => {
                  return (
                    <DatePicker
                      inputFormat="DD-MM-YYYY"
                      label={messages.eventOverviewCard.startDate()}
                      onChange={(newValue) => {
                        setStartDate(dayjs(newValue));
                      }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            inputProps={{ ...params.inputProps, ...props }}
                          />
                        );
                      }}
                      value={dayjs(startDate)}
                    />
                  );
                }}
                renderPreview={() => {
                  if (startDate) {
                    return (
                      <>
                        <Typography
                          color="secondary"
                          component="h3"
                          variant="subtitle1"
                        >
                          {messages.eventOverviewCard.startDate().toUpperCase()}
                        </Typography>
                        <ZUIDate
                          datetime={new Date(
                            dayjs(startDate).format()
                          ).toISOString()}
                        />
                      </>
                    );
                  } else {
                    return <></>;
                  }
                }}
                value={dayjs(startDate).format() ?? ''}
              />
            </Box>

            <Box m={2}>
              <ZUIPreviewableInput
                {...previewableProps}
                renderInput={(props) => {
                  return (
                    <DatePicker
                      inputFormat="DD-MM-YYYY"
                      label={messages.eventOverviewCard.endDate()}
                      onChange={(newValue) => {
                        setEndDate(dayjs(newValue));
                        if (
                          startDate &&
                          newValue &&
                          endDateIsBeforeStartDate(
                            startDate.toDate(),
                            newValue.toDate()
                          )
                        ) {
                          setStartDate(newValue);
                        }
                      }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            inputProps={{ ...params.inputProps, ...props }}
                          />
                        );
                      }}
                      value={dayjs(endDate)}
                    />
                  );
                }}
                renderPreview={() => {
                  if (
                    endDate &&
                    startDate &&
                    !isSameDate(startDate.toDate(), endDate.toDate())
                  ) {
                    return (
                      <>
                        <Typography
                          color="secondary"
                          component="h3"
                          variant="subtitle1"
                        >
                          {messages.eventOverviewCard.endDate().toUpperCase()}
                        </Typography>
                        <ZUIDate
                          datetime={new Date(
                            dayjs(endDate).format()
                          ).toISOString()}
                        />
                      </>
                    );
                  } else if (
                    endDate &&
                    startDate &&
                    isSameDate(startDate.toDate(), endDate.toDate())
                  ) {
                    return (
                      <Button variant="outlined">
                        {messages.eventOverviewCard.buttonEndDate()}
                      </Button>
                    );
                  } else {
                    return <></>;
                  }
                }}
                value={dayjs(endDate).format() ?? ''}
              />
            </Box>

            <Box m={2}>
              <ZUIPreviewableInput
                {...previewableProps}
                renderInput={(props) => {
                  return (
                    <TimePicker
                      ampm={false}
                      inputFormat="HH:mm"
                      label={messages.eventOverviewCard.startTime()}
                      onChange={(newValue) => {
                        setStartDate(dayjs(newValue));
                      }}
                      open={false}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            inputProps={{ ...params.inputProps, ...props }}
                          />
                        );
                      }}
                      value={dayjs(startDate)}
                    />
                  );
                }}
                renderPreview={() => {
                  if (startDate) {
                    return (
                      <FormattedTime
                        hour12={false}
                        value={new Date(
                          dayjs(startDate).format()
                        ).toISOString()}
                      />
                    );
                  } else {
                    return <></>;
                  }
                }}
                value={dayjs(startDate).format()}
              />
            </Box>
            <Box m={2}>
              <ZUIPreviewableInput
                {...previewableProps}
                renderInput={(props) => {
                  return (
                    <TimePicker
                      ampm={false}
                      inputFormat="HH:mm"
                      label={messages.eventOverviewCard.endTime()}
                      onChange={(newValue) => {
                        setEndDate(dayjs(newValue));
                      }}
                      open={false}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            inputProps={{ ...params.inputProps, ...props }}
                          />
                        );
                      }}
                      value={dayjs(endDate)}
                    />
                  );
                }}
                renderPreview={() => {
                  if (
                    endDate &&
                    startDate &&
                    !isSameTime(startDate.unix(), endDate.unix())
                  ) {
                    return (
                      <FormattedTime
                        hour12={false}
                        value={new Date(dayjs(endDate).format()).toISOString()}
                      />
                    );
                  } else {
                    return <></>;
                  }
                }}
                value={dayjs(endDate).format()}
              />
            </Box>
          </Box>
          <Divider orientation="vertical"></Divider>

          <Box m={2}>
            <ZUIPreviewableInput
              {...previewableProps}
              renderInput={() => {
                return (
                  <Box alignItems="center" display="flex">
                    <Autocomplete
                      disableClearable
                      fullWidth
                      onChange={(ev, value) => {
                        if (value === 'CREATE_NEW_LOCATION') {
                          setLocationModalOpen(true);
                        }
                        const location = locations?.find(
                          (location) => location.title === value
                        );
                        if (!location) {
                          return;
                        }
                        setLocationId(location.id);
                      }}
                      options={
                        locations
                          ?.map((location) => location.title)
                          .concat(['CREATE_NEW_LOCATION']) || []
                      }
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
                        ) : (
                          <li {...params}>{option}</li>
                        )
                      }
                      value={
                        locations?.find(
                          (location) => location.id === locationId
                        )?.title
                      }
                    />
                    <Place
                      color="secondary"
                      onClick={() => setLocationModalOpen(true)}
                      sx={{ cursor: 'pointer', marginLeft: 2 }}
                    />
                    <LocationModal
                      locationId={locationId}
                      locations={locations || []}
                      onMapClose={() => setLocationModalOpen(false)}
                      onSelectLocation={(location: ZetkinLocation) =>
                        setLocationId(location.id)
                      }
                      open={locationModalOpen}
                    />
                  </Box>
                );
              }}
              renderPreview={() => {
                if (eventData.location) {
                  return (
                    <Box>
                      <Typography
                        color="secondary"
                        component="h3"
                        variant="subtitle1"
                      >
                        {messages.eventOverviewCard.location().toUpperCase()}
                      </Typography>
                      <Typography
                        sx={{ alignItems: 'flex-start', display: 'flex' }}
                        variant="body2"
                      >
                        {eventData.location.title}
                      </Typography>
                    </Box>
                  );
                } else {
                  return <></>;
                }
              }}
              value={locationId || ''}
            />
          </Box>
          <Box m={2}>
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
                if (eventData.url && eventData.url !== '') {
                  return (
                    <Box>
                      <Typography
                        color={theme.palette.text.secondary}
                        component="h3"
                        variant="subtitle1"
                      >
                        {messages.eventOverviewCard.url().toUpperCase()}
                      </Typography>
                      <Typography
                        sx={{ alignItems: 'flex-start', display: 'flex' }}
                        variant="body2"
                      >
                        {eventData.url}
                        <Link
                          href={getWorkingUrl(eventData.url)}
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
          </Box>
          <Box m={2}>
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
                  sx={{ marginBottom: 2 }}
                  value={infoText}
                />
              )}
              renderPreview={() => {
                if (eventData.info_text !== '') {
                  return (
                    <Box>
                      <Typography
                        color={theme.palette.text.secondary}
                        component="h3"
                        variant="subtitle1"
                      >
                        {messages.eventOverviewCard.description().toUpperCase()}
                      </Typography>
                      <Typography variant="body2">
                        {eventData.info_text}
                      </Typography>
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
