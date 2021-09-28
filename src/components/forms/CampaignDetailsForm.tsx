import { Form } from 'react-final-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import {  Autocomplete, TextField } from 'mui-rff';
import { Avatar, Box, MenuItem, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import getPeopleSearchResults from 'fetching/getPeopleSearchResults';
import SubmitCancelButtons from './common/SubmitCancelButtons';
import useDebounce from 'hooks/useDebounce';
import { ZetkinCampaign, ZetkinPerson } from 'types/zetkin';

interface CampaignDetailsFormProps {
    campaign?: ZetkinCampaign;
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel: () => void;
}

const CampaignDetailsForm = ({ onSubmit, onCancel, campaign }: CampaignDetailsFormProps): JSX.Element => {
    const { orgId } = useRouter().query;
    const intl = useIntl();

    const [searchFieldValue, setSearchFieldValue] = useState<string>('');
    const { isLoading, refetch, data: results } = useQuery(
        ['peopleSearchResults', searchFieldValue],
        getPeopleSearchResults(searchFieldValue, orgId as string),
        { enabled: false },
    );

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
        const { info_text, status, title, visibility, manager_id } = values;
        onSubmit({
            info_text: info_text ?? '',
            manager_id,
            published:status === 'draft' ? false : true,
            title: title,
            visibility,
        });
    };

    return (
        <Form
            data-testid="campaign-details-form"
            initialValues={ initialValues }
            onSubmit={ handleSubmit }
            render={ ({ handleSubmit, submitting, valid }) => (
                <form noValidate onSubmit={ handleSubmit }>
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
                        defaultValue={
                            {
                                first_name:campaign?.manager?.name.split(' ')[0],
                                id: campaign?.manager?.id,
                                last_name: campaign?.manager?.name.split(' ')[1],
                            } as Partial<ZetkinPerson>  || null
                        }
                        filterOptions={ (options) => options } // override filtering
                        getOptionLabel={ person => person.first_name ? `${person.first_name} ${person.last_name}` : '' }
                        getOptionValue={ person => person.id || null }
                        id="manager_id"
                        label={ intl.formatMessage({ id: 'misc.formDialog.campaign.manager' }) }
                        name="manager_id"
                        noOptionsText={ searchLabel }
                        onInputChange={ (_, v) => {
                            setSearchFieldValue(v);
                        } }
                        options={ results || [] }
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
                    />

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
