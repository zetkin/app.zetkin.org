import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
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
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';

type EventOverviewCardProps = {
  model: EventDataModel;
};

const EventOverviewCard: FC<EventOverviewCardProps> = ({ model }) => {
  const eventData = model.getData().data;
  const messages = useMessages(messageIds);
  const [editable, setEditable] = useState(false);
  const [link, setLink] = useState(eventData?.url ?? '');
  const [infoText, setInfoText] = useState(eventData?.info_text ?? '');

  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter: () => setEditable(true),
      onEditModeExit: () => setEditable(false),
      save: () => {
        model.updateEventData({
          info_text: infoText,
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
