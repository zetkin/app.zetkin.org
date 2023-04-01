import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Button,
  Card,
  ClickAwayListener,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import { getWorkingUrl } from 'features/events/utils/getWorkingUrl';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';

type EventOverviewCardProps = {
  editable: boolean;
  element: ZetkinEvent;
  model: EventDataModel;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
};

const EventOverviewCard: FC<EventOverviewCardProps> = ({
  editable,
  element,
  model,
  onEditModeEnter,
  onEditModeExit,
}) => {
  const messages = useMessages(messageIds);
  const [startDate, setStartDate] = useState(element.start_time);
  const [endDate, setEndDate] = useState(element.end_time);
  const [link, setLink] = useState(element.url);
  const [infoText, setInfoText] = useState(element.info_text);

  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter,
      onEditModeExit,
      save: () => {
        model.updateEventData({
          end_time: endDate,
          info_text: infoText,
          start_time: startDate,
          url: link,
        });
      },
    });

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
          <Box
            m={2}
            sx={{
              alignItems: 'baseline',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              label="Start"
              onChange={(ev) => setStartDate(ev.target.value)}
              variant="outlined"
            ></TextField>

            <TextField
              label="End"
              onChange={(ev) => setEndDate(ev.target.value)}
              sx={{ marginRight: '10px' }}
              variant="outlined"
            />
            <Divider orientation="vertical"></Divider>
            <TextField label="Location" variant="outlined" />
            <LocationOnIcon />
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
                if (element.url && element.url !== '') {
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
                        {element.url}
                        <Link
                          href={getWorkingUrl(element.url)}
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
                if (element.info_text !== '') {
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
                        {element.info_text}
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
