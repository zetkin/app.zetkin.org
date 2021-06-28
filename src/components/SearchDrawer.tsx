import { FocusEventHandler, FunctionComponent, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Box, InputAdornment, makeStyles, TextField, Typography } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

import getSearchDrawerResults from '../fetching/getSearchDrawerResults';
import useDebounce from '../hooks/useDebounce';

const useStyles = makeStyles(() => ({
    textField: {
        width: '100%',
    },
}));

interface SearchDrawerProps {
    orgId: string;
}

const SearchDrawer: FunctionComponent<SearchDrawerProps> = ({ orgId }): JSX.Element | null => {
    const intl = useIntl();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const classes = useStyles();

    // Gets the search results if user stops typing
    const debouncedSearch = useDebounce(async (debouncedSearchQuery: string) => {
        if (searchQuery.length > 0) {
            getSearchDrawerResults(searchQuery, orgId);
        }
    }, 600);

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
                    <TextField
                        aria-label={ intl.formatMessage({
                            id: 'layout.organize.search.label',
                        }) }
                        className={ classes.textField }
                        id="input-with-icon-textfield"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        onChange={ e => {
                            if (!drawerOpen) {
                                setDrawerOpen(true);
                            }
                            debouncedSearch(e.target.value);
                        } }
                        onFocus={ expand }
                        onKeyUp={ e => {
                            if (e.key === 'Escape') {
                                setDrawerOpen(false);
                            }
                        } }
                        placeholder={ intl.formatMessage({
                            id: 'layout.organize.search.placeholder',
                        }) }
                        size="small"
                        variant="outlined"
                    />
                    { /* Search Drawer Content */ }
                    <Box display={ drawerOpen ? 'block' : 'none' }>
                        <Box display="flex" flexDirection="row-reverse">
                            <Typography variant="body2">
                                <Msg id="layout.organize.search.drawerLabel"/>
                            </Typography>
                        </Box>
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
