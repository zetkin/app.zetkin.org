import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import {
    Box,
    Container,
    Typography,
} from '@material-ui/core';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import getPeopleSearchResults from '../../fetching/getPeopleSearchResults';
import useDebounce from '../../hooks/useDebounce';

import ResultsList from './ResultsList';
import SearchField from './SearchField';

export const MINIMUM_CHARACTERS = 3;

const SearchDrawer: FunctionComponent = (): JSX.Element | null => {
    const router = useRouter();
    const { orgId } = router.query as {orgId: string};

    const drawer = useRef<HTMLDivElement>(null);
    const searchField = useRef<HTMLInputElement>(null);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchFieldValue, setSearchFieldValue] = useState<string>('');

    const { refetch, data: results, isIdle, isFetching } = useQuery(
        ['searchDrawerResults', searchFieldValue],
        getPeopleSearchResults(searchFieldValue, orgId),
        { enabled: false },
    );

    const debouncedQuery = useDebounce(async () => {
        refetch();
    }, 600);

    // Watch for changes on the search field value and debounce search if changed
    useEffect(() => {
        if (searchFieldValue.length >= MINIMUM_CHARACTERS) debouncedQuery();
    }, [searchFieldValue, debouncedQuery]);


    /** Event Listeners **/
    useEffect( () => {
        // Keypress Events
        const handleKeyUp = (e: KeyboardEvent) => {
            // Close drawer if pressing escape
            if (e.key === 'Escape') {
                searchField.current?.blur();
                setDrawerOpen(false);
            }
        };

        // Click Events
        function handleClick(e: MouseEvent) {
            // If user clicks outside of open drawer, close it
            if (drawer.current != null) {
                if (!drawer.current.contains(e.target as Node)) {
                    setDrawerOpen(false);
                }
            }
        }

        // Route Change Events
        const handleRouteChange = () => {
            // Close search on route change
            setDrawerOpen(false);
        };

        router.events.on('routeChangeStart', handleRouteChange);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('click', handleClick);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('click', handleClick);
        };

    }, [drawerOpen, router, searchField],
    );

    return (
        <>
            <div
                className={ `overlay ${drawerOpen ? null : 'hidden'}` }
                tabIndex={ -1 }>
                <div
                    ref={ drawer }
                    className={ `drawer ${drawerOpen ? 'expanded' : 'collapsed'}` }>
                    <SearchField
                        ref={ searchField }
                        data-testid="search-field"
                        onChange={ e => {
                            if (!drawerOpen) setDrawerOpen(true);
                            setSearchFieldValue(e.target.value);
                        } }
                        onFocus={ (e) => {
                            e.stopPropagation();
                            if (!drawerOpen) setDrawerOpen(true);
                        } }
                        onSubmit={ (e) => {
                            e.preventDefault();
                            // If user presses enter while focussed, navigate to full results
                            if (searchFieldValue.length >= MINIMUM_CHARACTERS) {
                                router.push({
                                    pathname: `/organize/${orgId}/search`,
                                    query: { q: encodeURIComponent(searchFieldValue) },
                                });
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
                                loading={ isIdle || isFetching }
                                orgId={ orgId }
                                results={ results ?? [] }
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
                    overflow: auto;
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
                .collapsed {
                    overflow-y: hidden;
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
