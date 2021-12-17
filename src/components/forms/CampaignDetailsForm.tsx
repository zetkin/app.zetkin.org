import { Form } from 'react-final-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Autocomplete, TextField } from 'mui-rff';
import { Avatar, Box, Link, MenuItem, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import getUserMemberships from 'fetching/getUserMemberships';
import SubmitCancelButtons from './common/SubmitCancelButtons';
import useDebounce from 'hooks/useDebounce';
import { useGetPeopleSearchResults } from 'fetching/getPeopleSearchResults';
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

    const [searchFieldValue, setSearchFieldValue] = useState<string>('');

    const [selectedManager, setSelectedManager] = useState<Partial<ZetkinPerson> | null>(campaign?.manager? {
        first_name: campaign.manager.name.split(' ')[0],
        id: campaign.manager.id,
        last_name: campaign?.manager.name.split(' ')[1],
    } as Partial<ZetkinPerson> : null);

    const { isLoading, refetch, data: results } = useGetPeopleSearchResults(searchFieldValue, orgId as string);

    let searchLabel = searchFieldValue.length ?
        intl.formatMessage({ id: 'misc.formDialog.campaign.keepSearch' }) :
        intl.formatMessage({ id: 'misc.formDialog.campaign.search' });

    if (isLoading) {
        searchLabel = intl.formatMessage({ id: 'misc.formDialog.campaign.searching' });
    }
    else if (results?.length == 0) {
        searchLabel = intl.formatMessage({ id: 'misc.formDialog.campaign.noResult' });
    }

    const debouncedQuery = useDebounce(async () => {
        refetch();
    }, 600);

    // Watch for changes on the search field value and debounce search if changed
    useEffect(() => {
        if (searchFieldValue.length >= 3) {
            debouncedQuery();
        }
    }, [searchFieldValue.length, debouncedQuery]);

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

    let managerOptions = (results || []) as Partial<ZetkinPerson>[];
    if (selectedManager && !managerOptions.some(o => o.id === selectedManager.id)) {
        managerOptions = [selectedManager].concat(managerOptions);
    }

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

                    <Autocomplete
                        filterOptions={ (options) => options } // override filtering
                        getOptionLabel={ person => person.first_name ? `${person.first_name} ${person.last_name}` : '' }
                        getOptionSelected={ (option, value) => option?.id == value?.id }
                        getOptionValue={ person => person.id || null }
                        label={ intl.formatMessage({ id: 'misc.formDialog.campaign.manager.label' }) }
                        name="manager_id"
                        noOptionsText={ searchLabel }
                        onChange={ (_, v) => {
                            setSelectedManager(v as Partial<ZetkinPerson>);
                        } }
                        onInputChange={ (_, v) => {
                            setSearchFieldValue(v);
                        } }
                        options={ managerOptions }
                        renderOption={ (person) => (
                            <Box alignItems="center" display="flex">
                                <Box m={ 1 }>
                                    <Avatar
                                        src={ `/api/orgs/${orgId}/people/${person.id}/avatar` }>
                                    </Avatar>
                                </Box>
                                <Typography>
                                    { `${ person.first_name } ${ person.last_name }` }
                                </Typography>
                            </Box>
                        ) }
                        value={ selectedManager }
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
