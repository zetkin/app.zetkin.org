import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Add, Map } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  ClickAwayListener,
  Link,
  TextField,
  Typography,
} from '@mui/material';
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
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';

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
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter: () => setEditable(true),
      onEditModeExit: () => setEditable(false),
      save: () => {
        dataModel.updateEventData({
          info_text: infoText,
          location_id: locationId,
          url: link,
        });
      },
    });

  if (!eventData) {
    return null;
  }

  const options: (ZetkinLocation | 'CREATE_NEW_LOCATION')[] = locations
    ? [...locations, 'CREATE_NEW_LOCATION']
    : ['CREATE_NEW_LOCATION'];

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
          <Box m={2}>
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
                          ? messages.locationModal.createLocation()
                          : option.title
                      }
                      onChange={(ev, option) => {
                        if (option === 'CREATE_NEW_LOCATION') {
                          setLocationModalOpen(true);
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
                        ) : (
                          <li {...params}>{option.title}</li>
                        )
                      }
                      value={options?.find(
                        (location) =>
                          location !== 'CREATE_NEW_LOCATION' &&
                          location.id === locationId
                      )}
                    />
                    <Map
                      color="secondary"
                      onClick={() => setLocationModalOpen(true)}
                      sx={{ cursor: 'pointer', marginLeft: 2 }}
                    />
                    <LocationModal
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
