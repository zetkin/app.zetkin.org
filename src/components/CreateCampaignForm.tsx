import { useState } from 'react';
import { Button, MenuItem, TextField } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

interface CreateCampaignFormProps {
    onSubmit: () => void;
    onCancel: () => void;
}

const CreateCampaignForm = ({ onSubmit, onCancel }: CreateCampaignFormProps): JSX.Element => {
    const intl = useIntl();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [status, setStatus] = useState('unpublished');

    const handleSubmit = () => {
        alert(`${name} ${desc} ${visibility} ${status}`);
        //TO DO : handle form submit
        onSubmit();
    };

    const required = intl.formatMessage({ id: 'misc.formDialog.required' });

    return (
        <>
            <form onSubmit={ handleSubmit }>
                <TextField defaultValue={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.name' }) } fullWidth id={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.name' }) } label={ required } margin="normal" onChange={ (e) => setName(e.target.value) } required/>
                <TextField defaultValue={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.description' }) } fullWidth id={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.description' }) } margin="normal" multiline onChange={ (e) => setDesc(e.target.value) } required/>
                <TextField
                    fullWidth id="status"
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.status.heading' }) }
                    margin="normal"
                    onChange={ (e) => setStatus(e.target.value) }
                    select>
                    <MenuItem value="published">
                        <Msg id="misc.formDialog.createNew.campaign.status.published" />
                    </MenuItem>
                    <MenuItem value="draft">
                        <Msg id="misc.formDialog.createNew.campaign.status.draft" />
                    </MenuItem>
                </TextField>
                <TextField fullWidth id="visibility"
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.visibility.heading' }) }
                    margin="normal"
                    onChange={ (e) => setVisibility(e.target.value) }
                    select>
                    <MenuItem value="private">
                        <Msg id="misc.formDialog.createNew.campaign.visibility.private" />
                    </MenuItem>
                    <MenuItem value="public">
                        <Msg id="misc.formDialog.createNew.campaign.visibility.public" />
                    </MenuItem>
                </TextField>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.formDialog.cancel" />
                </Button>
                <Button color="primary" type="submit" variant="contained">
                    <Msg id="misc.formDialog.submit" />
                </Button>
            </form>
        </>
    );
};

export default CreateCampaignForm;
