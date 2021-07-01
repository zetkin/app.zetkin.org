import { useState } from 'react';
import { Box, Button, MenuItem, TextField } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

interface CreateCampaignFormProps {
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel: () => void;
}

const CreateCampaignForm = ({ onSubmit, onCancel }: CreateCampaignFormProps): JSX.Element => {
    const intl = useIntl();
    const [title, setTitle] = useState('');
    const [info, setInfo] = useState('');
    const [visibility, setVisibility] = useState('hidden');
    const [status, setStatus] = useState('draft');

    const handleSubmit = () => {
        onSubmit({
            ...info ? { info_text: info } : null,
            published:status === 'draft' ? false : true,
            title: title,
            visibility,
        });
    };

    return (
        <>
            <form onSubmit={ handleSubmit }>
                <TextField fullWidth id={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.name' }) } label={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.name' }) } margin="normal" onChange={ (e) => setTitle(e.target.value) } required/>
                <TextField fullWidth id={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.description' }) } label={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.description' }) } margin="normal" multiline onChange={ (e) => setInfo(e.target.value) } />
                <TextField
                    fullWidth id="status"
                    label={ intl.formatMessage({ id: 'misc.formDialog.createNew.campaign.status.heading' }) }
                    margin="normal"
                    onChange={ (e) => setStatus(e.target.value) }
                    select value={ status }>
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
                    select value={ visibility }>
                    <MenuItem value="hidden">
                        <Msg id="misc.formDialog.createNew.campaign.visibility.private" />
                    </MenuItem>
                    <MenuItem value="open">
                        <Msg id="misc.formDialog.createNew.campaign.visibility.public" />
                    </MenuItem>
                </TextField>
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
        </>
    );
};

export default CreateCampaignForm;
