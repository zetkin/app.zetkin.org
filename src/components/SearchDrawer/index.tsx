import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import {
    Box,
    Container,
    Typography,
} from '@material-ui/core';
import { FocusEventHandler, FunctionComponent, useState } from 'react';

import getSearchDrawerResults from '../../fetching/getSearchDrawerResults';
import useDebounce from '../../hooks/useDebounce';

import ResultsList from './ResultsList';
import SearchField from './SearchField';
import { useEffect } from 'react';

interface SearchDrawerProps {
    orgId: string;
}

const SearchDrawer: FunctionComponent<SearchDrawerProps> = ({ orgId }): JSX.Element | null => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchFieldValue, setSearchFieldValue] = useState<string>('');

    const { refetch, data: searchResults, isLoading } = useQuery(
        ['searchDrawerResults', searchFieldValue],
        getSearchDrawerResults(searchFieldValue, orgId),
        { enabled: false },
    );

    const debouncedQuery = useDebounce(async () => {
        refetch();
    }, 600);

    // Watch for changes on the search field value and debounce search if changed
    useEffect(() => {
        if (searchFieldValue.length > 3) debouncedQuery();
    }, [searchFieldValue, debouncedQuery]);

    const collapse:FocusEventHandler<Element> = (e) => {
        e.stopPropagation();
        setDrawerOpen(false);
    };

    const expand:FocusEventHandler<Element> = (e) => {
        e.stopPropagation();
        setDrawerOpen(true);
    };


    return (
        <>
            <div
                className={ `overlay ${drawerOpen ? null : 'hidden'}` }
                onFocus={ collapse } tabIndex={ -1 }>
                <div
                    className={ `drawer ${drawerOpen ? 'expanded' : 'collapsed'}` }>
                    <SearchField
                        onChange={ e => {
                            if (!drawerOpen) {
                                setDrawerOpen(true);
                            }
                            setSearchFieldValue(e.target.value);
                        } }
                        onFocus={ expand }
                        onKeyUp={ e => {
                            if (e.key === 'Escape') {
                                setDrawerOpen(false);
                            }
                        } }

                    />
                    { /* Search Drawer Content */ }
                    <Box display={ drawerOpen ? 'block' : 'none' }>
                        <Box display="flex" flexDirection="row-reverse">
                            <Typography variant="body2">
                                <Msg id="layout.organize.search.drawerLabel"/>
                            </Typography>
                        </Box>
                        <Container>
                            <ResultsList
                                loading={ isLoading }
                                results={ searchResults ?? [] }
                                searchFieldValue={ searchFieldValue }
                            />

                        </Container>
                    </Box>
                </div>
            </div>

            <style jsx>{ `
                div {
                    position: absolute;
                    padding: 0 0 0 1rem;
                }
                .overlay {
                    width: 100vw;
                    height: 100vh;
                    top: 0;
                    right: 0;
                    background: rgba(0, 0, 0,0.5);
                    z-index: 2;
                }
                .hidden {
                    width: 0; height: 0;
                }
                .drawer {
                    width: 25vw;
                    transition: width 500ms;
                    top: 1rem;
                    right: 1rem;
                    overflow-y: scroll;
                }
                .expanded {
                    background: white;
                    width: 50vw;
                    transition: width 500ms;
                    height: 100vh;
                    padding: 1rem;
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 3;
                }
                @media screen and (max-width: 600px) {
                    .drawer {
                        width: 40vw;
                    }
                }
                ` }
            </style>
        </>
    );
};

export default SearchDrawer;
