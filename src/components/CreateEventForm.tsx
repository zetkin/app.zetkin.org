import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { useQuery } from 'react-query';
import { Box, Button, Grid, GridSize, MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import getActivities from '../fetching/getActivities';
import getCampaigns from '../fetching/getCampaigns';
import getLocations from '../fetching/getLocations';

interface CreateEventFormProps {
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel: () => void;
    orgId: string;
}

const CreateEventForm = ({ onSubmit, onCancel, orgId }: CreateEventFormProps): JSX.Element => {
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const activitiesQuery = useQuery(['actvities', orgId], getActivities(orgId));
    const locationsQuery = useQuery(['locations', orgId], getLocations(orgId));

    const activities = activitiesQuery.data || [];
    const locations = locationsQuery.data || [];
    const campaigns = campaignsQuery.data || [];
    const intl = useIntl();

    const validate = (values: Record<string, string>) => {
        const errors:Record<string, string> = {};
        if (!values.title) {
            errors.title = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        return errors;
    };

    const handleSubmit = (values: Record<string, string>) => {
        const { activity_id, campaign_id, end_time, info_text, start_time, location_id, num_participants_required, title, url } = values;

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
                <TextField fullWidth id="title" label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.title' }) } margin="normal" name="title" />
            ),
            size: 12,
        },
        {
            field: (
                <TextField fullWidth id="camp" label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.campaign' }) }
                    margin="normal"
                    name="campaign_id"
                    select>
                    { campaigns.map(c => (
                        <MenuItem key={ c.id } value={ c.id }>
                            { c.title }
                        </MenuItem>
                    )) }
                </TextField>
            ),
            size: 12,
        },
        {
            field: (
                <TextField fullWidth id="activity"
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.activity' }) }
                    margin="normal"
                    name="activity_id"
                    select>
                    { activities.map(a => (
                        <MenuItem key={ a.id } value={ a.id }>
                            { a.title }
                        </MenuItem>
                    )) }
                </TextField>
            ),
            size: 12,
        },
        {
            field: (
                <TextField fullWidth id="location"
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.place' }) }
                    margin="normal"
                    name="location_id"
                    select>
                    { locations.map(l => (
                        <MenuItem key={ l.id } value={ l.id }>
                            { l.title }
                        </MenuItem>
                    )) }
                </TextField>
            ),
            size: 12,
        },
        {
            field: (
                <TextField id="start-time"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.start' }) }
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
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.end' }) }
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
                    defaultValue={ 0 }
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.minNo' }) }
                    name="num_participants_required"
                    type="number"
                />
            ), size: 12,
        },
        {
            field: (
                <TextField fullWidth id="info" label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.info' }) } margin="normal" multiline name="info_text" rows={ 3 } variant="outlined" />
            ),
            size: 12,
        },
        {
            field: (
                <TextField fullWidth id="link" label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.link' }) } margin="normal" name="url" />
            ),
            size: 12,
        },
    ];

    const now = new Date(Date.now());
    const today = new Date( Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0));

    return (
        <Form
            initialValues={{ end_time: today.toISOString().slice(0, 16), start_time: today.toISOString().slice(0, 16)  }}
            onSubmit={ handleSubmit }
            render={ ({ handleSubmit, submitting }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    <Grid alignItems="flex-start" container spacing={ 2 }>
                        { formFields.map((item, idx) => (
                            <Grid key={ idx } item xs={ item.size as GridSize }>
                                { item.field }
                            </Grid>
                        )) }
                        <Grid item style={{ marginTop: 16 }}>
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" width={ 1 }>
                            <Box m={ 1 }>
                                <Button color="primary" onClick={ onCancel }>
                                    <Msg id="misc.formDialog.cancel" />
                                </Button>
                            </Box>
                            <Box m={ 1 }>
                                <Button color="primary" disabled={ submitting } type="submit" variant="contained">
                                    <Msg id="misc.formDialog.submit" />
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </form>
            ) }
            validate={ validate }
        />
    );
};

export default CreateEventForm;
