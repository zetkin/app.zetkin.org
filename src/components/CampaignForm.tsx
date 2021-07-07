import { Form } from 'react-final-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import {  Autocomplete, TextField } from 'mui-rff';
import { Box, Button, MenuItem } from '@material-ui/core';
import { Grid, GridSize } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import getSearchDrawerResults from '../fetching/getSearchDrawerResults';
import useDebounce from '../hooks/useDebounce';
import { ZetkinCampaign, ZetkinPerson } from '../types/zetkin';

interface CampaignFormProps {
    campaign?: ZetkinCampaign;
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel: () => void;
}

const CampaignForm = ({ onSubmit, onCancel, campaign }: CampaignFormProps): JSX.Element => {
    const { orgId } = useRouter().query;
    const intl = useIntl();

    const [people, setPeople] = useState<ZetkinPerson[]>([]);

    const [searchFieldValue, setSearchFieldValue] = useState<string>('');
    const { refetch, data: results } = useQuery(
        ['searchDrawerResults', searchFieldValue],
        getSearchDrawerResults(searchFieldValue, orgId as string),
        { enabled: false },
    );

    const debouncedQuery = useDebounce(async () => {
        refetch();
    }, 600);

    // Watch for changes on the search field value and debounce search if changed
    useEffect(() => {
        if (searchFieldValue.length >= 3)
            debouncedQuery();
        if (results) {
            setPeople(results);
        }
    }, [searchFieldValue, debouncedQuery, results]);

    const initialValues = {
        info_text: campaign?.info_text,
        status: campaign?.published,
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

    const formFields = [
        {
            field: (
                <TextField
                    fullWidth
                    id="title"
                    label={ intl.formatMessage({ id: 'misc.formDialog.campaign.name' }) }
                    margin="normal"
                    name="title"
                    required
                />
            ),
            size: 12,
        },
        {
            field: (
                <TextField
                    fullWidth id="info_text"
                    label={ intl.formatMessage({ id: 'misc.formDialog.campaign.description' }) }
                    margin="normal"
                    multiline
                    name="info_text"
                    rows={ 5 }
                    variant="outlined"
                />
            ),
            size: 12,
        },
        {
            field: (
                <Autocomplete
                    defaultValue={{ first_name:campaign?.manager?.name.split(' ')[0], id: campaign?.manager?.id, last_name: campaign?.manager?.name.split(' ')[1] } as Partial<ZetkinPerson>  || null}
                    getOptionLabel={ person => `${person.first_name || ''} ${person.last_name || ''}` }
                    getOptionValue={ person => person.id || 0 }
                    label={ intl.formatMessage({ id: 'misc.formDialog.campaign.manager' }) }
                    name="manager_id"
                    onInputChange={ (_, v) => {
                        setSearchFieldValue(v);
                    } }
                    options={ people }
                />
            ),
            size: 12,
        },
        {
            field: (
                <TextField
                    fullWidth id="status"
                    label={ intl.formatMessage({ id: 'misc.formDialog.campaign.status.heading' }) }
                    margin="normal"
                    name="status" select>
                    <MenuItem value="published">
                        <Msg id="misc.formDialog.campaign.status.published" />
                    </MenuItem>
                    <MenuItem value="draft">
                        <Msg id="misc.formDialog.campaign.status.draft" />
                    </MenuItem>
                </TextField>
            ),
            size: 12,
        },
        {
            field: (
                <TextField fullWidth id="visibility"
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
            ),
            size: 12,
        },

    ];

    const handleSubmit = (values: Record<string, string>) => {
        const { info_text, status, title, visibility, manager_id } = values;
        onSubmit({
            ...info_text ? { info_text } : null,
            ...manager_id ? { manager_id } : null,
            published:status === 'draft' ? false : true,
            title: title,
            visibility,
        });
    };

    return (
        <Form
            initialValues={ initialValues }
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

export default CampaignForm;
