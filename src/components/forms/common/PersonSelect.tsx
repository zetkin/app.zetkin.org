import { Autocomplete } from 'mui-rff';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Avatar, Box, Typography } from '@material-ui/core';
import { FunctionComponent, useEffect, useState } from 'react';

import getPeopleSearchResults from 'fetching/getPeopleSearchResults';
import useDebounce from 'hooks/useDebounce';
import { ZetkinPerson } from 'types/zetkin';


interface PersonSelectProps {
    name: string;
    onChange: (person: Partial<ZetkinPerson>) => void;
    orgId: string | number;
    selectedPerson: Partial<ZetkinPerson> | null;
}

const PersonSelect: FunctionComponent<PersonSelectProps> = ({
    name,
    onChange,
    orgId,
    selectedPerson,
}) => {
    const intl = useIntl();
    const [searchFieldValue, setSearchFieldValue] = useState<string>('');

    const { isLoading, refetch, data: results } = useQuery(
        ['peopleSearchResults', searchFieldValue],
        getPeopleSearchResults(searchFieldValue, orgId.toString()),
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

    let personOptions = (results || []) as Partial<ZetkinPerson>[];
    if (selectedPerson && !personOptions.some(o => o.id === selectedPerson.id)) {
        personOptions = [selectedPerson].concat(personOptions);
    }

    return (
        <Autocomplete
            filterOptions={ (options) => options } // override filtering
            getOptionLabel={ person => person.first_name ? `${person.first_name} ${person.last_name}` : '' }
            getOptionSelected={ (option, value) => option?.id == value?.id }
            getOptionValue={ person => person.id || null }
            label={ intl.formatMessage({ id: 'misc.formDialog.campaign.manager.label' }) }
            name={ name }
            noOptionsText={ searchLabel }
            onChange={ (_, v) => {
                onChange(v as Partial<ZetkinPerson>);
            } }
            onInputChange={ (_, v) => {
                setSearchFieldValue(v);
            } }
            options={ personOptions }
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
            value={ selectedPerson }
        />
    );
};

export default PersonSelect;
