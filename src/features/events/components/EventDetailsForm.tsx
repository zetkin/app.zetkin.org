import dayjs from 'dayjs';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, Grid, GridSize, MenuItem } from '@mui/material';

import getActivities from 'utils/fetching/getActivities';
import getCampaigns from 'features/campaigns/fetching/getCampaigns';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useEventLocation from '../hooks/useEventLocation';

interface EventDetailsFormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  orgId: string;
}

const EventDetailsForm = ({
  onSubmit,
  onCancel,
  orgId,
}: EventDetailsFormProps): JSX.Element => {
  const router = useRouter();
  const { campId } = router.query;
  const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
  const activitiesQuery = useQuery(['actvities', orgId], getActivities(orgId));

  const activities = activitiesQuery.data || [];
  const campaigns = campaignsQuery.data || [];
  const messages = useMessages(messageIds);
  const locations = useEventLocation(parseInt(orgId));

  const formattedNow = dayjs().format('YYYY-MM-DDTHH:mm:ss');

  const initialValues = {
    campaign_id: campId,
    end_time: formattedNow,
    num_participants_required: 0,
    start_time: formattedNow,
  };

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    if (!values.title) {
      errors.title = messages.form.required();
    }
    return errors;
  };

  const handleSubmit = (values: Record<string, string>) => {
    const {
      activity_id,
      campaign_id,
      end_time,
      info_text,
      start_time,
      location_id,
      num_participants_required,
      title,
      url,
    } = values;

    onSubmit({
      activity_id,
      campaign_id,
      end_time: new Date(end_time + 'Z').toISOString(),
      info_text,
      location_id,
      num_participants_required: +num_participants_required,
      start_time: new Date(start_time + 'Z').toISOString(),
      title: title || null,
      url: url || null,
    });
  };

  const formFields = [
    {
      field: (
        <TextField
          fullWidth
          id="title"
          label={messages.form.title()}
          margin="normal"
          name="title"
        />
      ),
      size: 12,
    },
    {
      field: (
        <TextField
          disabled={!!campId}
          fullWidth
          id="camp"
          label={messages.form.campaign()}
          margin="normal"
          name="campaign_id"
          select
        >
          {campaigns.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.title}
            </MenuItem>
          ))}
        </TextField>
      ),
      size: 12,
    },
    {
      field: (
        <TextField
          fullWidth
          id="activity"
          label={messages.form.activity()}
          margin="normal"
          name="activity_id"
          select
        >
          {activities.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.title}
            </MenuItem>
          ))}
        </TextField>
      ),
      size: 12,
    },
    {
      field: (
        <TextField
          fullWidth
          id="location"
          label={messages.form.place()}
          margin="normal"
          name="location_id"
          select
        >
          {locations?.map((l) => (
            <MenuItem key={l.id} value={l.id}>
              {l.title}
            </MenuItem>
          ))}
        </TextField>
      ),
      size: 12,
    },
    {
      field: (
        <TextField
          id="start-time"
          InputLabelProps={{
            shrink: true,
          }}
          label={messages.form.start()}
          margin="normal"
          name="start_time"
          required
          type="datetime-local"
        />
      ),
      size: 6,
    },
    {
      field: (
        <TextField
          id="end-time"
          InputLabelProps={{
            shrink: true,
          }}
          label={messages.form.end()}
          margin="normal"
          name="end_time"
          required
          type="datetime-local"
        />
      ),
      size: 6,
    },
    {
      field: (
        <TextField
          defaultValue={0}
          InputLabelProps={{
            shrink: true,
          }}
          label={messages.form.minNo()}
          name="num_participants_required"
          type="number"
        />
      ),
      size: 12,
    },
    {
      field: (
        <TextField
          fullWidth
          id="info"
          label={messages.form.info()}
          margin="normal"
          multiline
          name="info_text"
          rows={3}
          variant="outlined"
        />
      ),
      size: 12,
    },
    {
      field: (
        <TextField
          fullWidth
          id="link"
          label={messages.form.link()}
          margin="normal"
          name="url"
        />
      ),
      size: 12,
    },
  ];

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={({ handleSubmit, submitting }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid alignItems="flex-start" container spacing={2}>
            {formFields.map((item, idx) => (
              <Grid key={idx} item xs={item.size as GridSize}>
                {item.field}
              </Grid>
            ))}
            <Grid item style={{ marginTop: 16 }} />
            <Box display="flex" justifyContent="flex-end" width={1}>
              <Box m={1}>
                <Button color="primary" onClick={onCancel}>
                  <Msg id={messageIds.form.cancel} />
                </Button>
              </Box>
              <Box m={1}>
                <Button
                  color="primary"
                  disabled={submitting}
                  type="submit"
                  variant="contained"
                >
                  <Msg id={messageIds.form.submit} />
                </Button>
              </Box>
            </Box>
          </Grid>
        </form>
      )}
      validate={validate}
    />
  );
};

export default EventDetailsForm;
