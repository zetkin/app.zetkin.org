import { useState } from 'react';
import { Button, MenuItem, TextField } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

interface CreateEventFormProps {
    onSubmit: () => void;
    onCancel: () => void;
}

const CreateEventForm = ({ onSubmit, onCancel }: CreateEventFormProps): JSX.Element => {
    const intl = useIntl();
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [info, setInfo] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [place, setPlace] = useState('');
    const [activity, setActivity] = useState('');
    const [campId, setCampId] = useState<number| undefined>();

    const activities = ['activity one', 'activity 2'];
    const places = ['dorfplatz', 'alexanderplatz'];
    const campIds = [1, 2];

    const handleSubmit = () => {
        alert(`${title} ${link} ${info} ${start} ${end} ${place} ${activity} ${campId}`);
        //TO DO : handle form submit
        onSubmit();
    };

    const required = intl.formatMessage({ id: 'misc.formDialog.required' });

    return (
        <form onSubmit={ handleSubmit }>
            <TextField fullWidth id="campId"
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.campaign' }) }
                margin="normal"
                onChange={ (e) => setCampId(+e.target.value) }
                select value={ campId }>
                { campIds.map(c => (
                    <MenuItem key={ c } value={ c }>
                        { c }
                    </MenuItem>
                )) }
            </TextField>
            <TextField fullWidth id="activity"
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.activity' }) }
                margin="normal"
                onChange={ (e) => setActivity(e.target.value) }
                select value={ activity }>
                { activities.map(a => (
                    <MenuItem key={ a } value={ a }>
                        { a }
                    </MenuItem>
                )) }
            </TextField>
            <TextField fullWidth id="place"
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.place' }) }
                margin="normal"
                onChange={ (e) => setPlace(e.target.value) }
                select>
                { places.map(p => (
                    <MenuItem key={ p } value={ p }>
                        { p }
                    </MenuItem>
                )) }
            </TextField>
            <TextField defaultValue={ new Date(Date.now()).toISOString() }
                fullWidth
                id="start-time"
                InputLabelProps={{
                    shrink: true,
                }}
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.start' }) }
                onChange={ (e) => setStart(e.target.value) }
                type="datetime-local"
            />
            <TextField
                defaultValue={ new Date(Date.now()).toISOString() }
                id="end-time"
                InputLabelProps={{
                    shrink: true,
                }}
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.end' }) }
                onChange={ (e) => setEnd(e.target.value) }
                type="datetime-local"
            />
            <TextField
                defaultValue={ 2 }
                InputLabelProps={{
                    shrink: true,
                }}
                label={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.minNo' }) }
                type="number"
            />
            <TextField defaultValue={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.title' }) } fullWidth id="title" label={ required } margin="normal" onChange={ (e) => setTitle(e.target.value) } required/>
            <TextField defaultValue={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.info' }) } fullWidth id="info" label={ required } margin="normal" multiline onChange={ (e) => setInfo(e.target.value) } required />
            <TextField defaultValue={ intl.formatMessage({ id: 'misc.formDialog.createNew.event.link' }) } fullWidth id="link" label={ required } margin="normal" onChange={ (e) => setLink(e.target.value) } required />
            <Button color="primary" onClick={ onCancel }>
                <Msg id="misc.formDialog.cancel" />
            </Button>
            <Button color="primary" type="submit" variant="contained">
                <Msg id="misc.formDialog.submit" />
            </Button>
        </form>
    );
};

export default CreateEventForm;
