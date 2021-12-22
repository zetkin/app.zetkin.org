import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Link, MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import getUserMemberships from 'fetching/getUserMemberships';
import PersonSelect from './common/PersonSelect';
import SubmitCancelButtons from './common/SubmitCancelButtons';
import { ZetkinCampaign, ZetkinPerson } from 'types/zetkin';

interface CampaignDetailsFormProps {
    campaign?: ZetkinCampaign;
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel: () => void;
}

const CampaignDetailsForm = ({ onSubmit, onCancel, campaign }: CampaignDetailsFormProps): JSX.Element => {
    const { orgId } = useRouter().query;
    const intl = useIntl();

    const membershipsQuery = useQuery('userMemberships', getUserMemberships());
    const activeMembership = membershipsQuery?.data?.find(m => m.organization.id.toString() == orgId);
    const userProfile = activeMembership?.profile;

    const [selectedManager, setSelectedManager] = useState<Partial<ZetkinPerson> | null>(campaign?.manager? {
        first_name: campaign.manager.name.split(' ')[0],
        id: campaign.manager.id,
        last_name: campaign?.manager.name.split(' ')[1],
    } as Partial<ZetkinPerson> : null);

    const initialValues = {
        info_text: campaign?.info_text,
        status: campaign?.published ? 'published' : 'draft',
        title: campaign?.title,
        visibility: campaign?.visibility,
    };

    const validate = (values: Record<string, string>) => {
        const errors:Record<string, string> = {};
        if (!values.title) {
            errors.title = intl.formatMessage({ id: 'misc.formDialog.required' });
        }
        return errors;
    };

    const handleSubmit = (values: Record<string, string>) => {
        const { info_text, status, title, visibility } = values;
        onSubmit({
            info_text: info_text ?? '',
            manager_id: selectedManager? selectedManager.id : null,
            published:status === 'draft' ? false : true,
            title: title,
            visibility,
        });
    };

    return (
        <Form
            initialValues={ initialValues }
            onSubmit={ handleSubmit }
            render={ ({ handleSubmit, submitting, valid }) => (
                <form
                    noValidate
                    onSubmit={ handleSubmit }>
                    <TextField
                        fullWidth
                        id="title"
                        label={ intl.formatMessage({ id: 'misc.formDialog.campaign.name' }) }
                        margin="normal"
                        name="title"
                        required
                    />


                    <TextField
                        fullWidth
                        id="info_text"
                        label={ intl.formatMessage({ id: 'misc.formDialog.campaign.description' }) }
                        margin="normal"
                        multiline
                        name="info_text"
                        rows={ 5 }
                        variant="outlined"
                    />

                    <PersonSelect
                        name="manager_id"
                        onChange={ (person) => {
                            setSelectedManager(person);
                        } }
                        orgId={ orgId as string }
                        selectedPerson={ selectedManager }
                    />

                    { (userProfile && userProfile.id != selectedManager?.id) && (
                        <Link
                            color="textPrimary"
                            component="button"
                            onClick={ () => {
                                // Select profile beloning to current user. We only need the ID
                                // to be correct, and the name to be reflected by first_name+last_name,
                                // so for simplicity we pass the entire name as first name.
                                setSelectedManager({
                                    first_name: userProfile.name,
                                    id: userProfile.id,
                                    last_name: '',
                                });
                            } }>
                            <Msg id="misc.formDialog.campaign.manager.selectSelf"/>
                        </Link>
                    ) }

                    <TextField
                        fullWidth
                        id="status"
                        label={ intl.formatMessage({ id: 'misc.formDialog.campaign.status.heading' }) }
                        margin="normal"
                        name="status"
                        select>
                        <MenuItem value="published">
                            <Msg id="misc.formDialog.campaign.status.published" />
                        </MenuItem>
                        <MenuItem value="draft">
                            <Msg id="misc.formDialog.campaign.status.draft" />
                        </MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        id="visibility"
                        label={ intl.formatMessage({ id: 'misc.formDialog.campaign.visibility.heading' }) }
                        margin="normal"
                        name="visibility"
                        select>
                        <MenuItem value="hidden">
                            <Msg id="misc.formDialog.campaign.visibility.private" />
                        </MenuItem>
                        <MenuItem value="open">
                            <Msg id="misc.formDialog.campaign.visibility.public" />
                        </MenuItem>
                    </TextField>

                    <SubmitCancelButtons onCancel={ onCancel } submitDisabled={ submitting || !valid } />
                </form>
            ) }
            validate={ validate }
        />
    );
};

export default CampaignDetailsForm;
