import { useQuery } from 'react-query';
import { useState } from 'react';
import { Box, Button, MenuItem, TextField } from '@material-ui/core';
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
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [info, setInfo] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [locationId, setLocationId] = useState<string | undefined>();
    const [activityId, setActivityId] = useState<string | undefined>();
    const [campId, setCampId] = useState<string | undefined>();
    const [numParticpants, setNumParticipants] = useState(0);

    const handleSubmit = () => {
        onSubmit({
            activity_id: activityId,
            campaign_id: campId,
            end_time: new Date(end).toISOString(),
            info_text: info,
            location_id: locationId,
            num_participants_required: numParticpants,
            start_time: new Date(start).toISOString(),
            title: title || null,
            url: url || null,
        });
    };

    return (
        <form onSubmit={ handleSubmit }>
            <TextField fullWidth id="title" label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.title' }) } margin="normal" onChange={ (e) => setTitle(e.target.value) } />

            <TextField fullWidth id="camp"
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.campaign' }) }
                margin="normal"
                onChange={ (e) => setCampId(e.target.value) }
                select>
                { campaigns.map(c => (
                    <MenuItem key={ c.id } value={ c.id }>
                        { c.title }
                    </MenuItem>
                )) }
            </TextField>
            <TextField fullWidth id="activity"
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.activity' }) }
                margin="normal"
                onChange={ (e) => setActivityId(e.target.value) }
                select>
                { activities.map(a => (
                    <MenuItem key={ a.id } value={ a.id }>
                        { a.title }
                    </MenuItem>
                )) }
            </TextField>
            <TextField fullWidth id="location"
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.place' }) }
                margin="normal"
                onChange={ (e) => setLocationId(e.target.value) }
                select>
                { locations.map(l => (
                    <MenuItem key={ l.id } value={ l.id }>
                        { l.title }
                    </MenuItem>
                )) }
            </TextField>
            <Box display="flex">
                <Box m={ 1 } ml={ 0 }>
                    <TextField defaultValue={ new Date(Date.now()).toISOString().slice(0, 16) } id="start-time"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.start' }) }
                        margin="normal"
                        onChange={ (e) => setStart(e.target.value + 'Z') }
                        required
                        type="datetime-local"
                    />
                </Box>
                <Box m={ 1 }>
                    <TextField
                        defaultValue={ new Date(Date.now()).toISOString().slice(0, 16) }
                        id="end-time"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.end' }) }
                        margin="normal"
                        onChange={ (e) => setEnd(e.target.value + 'Z') }
                        required
                        type="datetime-local"
                    />
                </Box>
            </Box>
            <TextField
                defaultValue={ 0 }
                InputLabelProps={{
                    shrink: true,
                }}
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.minNo' }) }
                onChange={ (e) => setNumParticipants(+e.target.value) }
                type="number"
            />

            <TextField fullWidth id="info" label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.info' }) } margin="normal" multiline onChange={ (e) => setInfo(e.target.value) } />

            <TextField fullWidth id="link" label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.link' }) } margin="normal" onChange={ (e) => setUrl(e.target.value) } />

            <Box display="flex" justifyContent="flex-end">
                <Box m={ 1 }>
                    <Button color="primary" onClick={ onCancel }>
                        <Msg id="misc.formDialog.cancel" />
                    </Button>
                </Box>
                <Box m={ 1 }>
                    <Button color="primary" type="submit" variant="contained">
                        <Msg id="misc.formDialog.submit" />
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default CreateEventForm;
