/* eslint-disable jsx-a11y/no-autofocus */

import { ExpandMore } from '@material-ui/icons';
import Link from 'next/link';
import { useAutocomplete } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, IconButton, List, ListItem, ListItemText, Popover, TextField } from '@material-ui/core';
import { FunctionComponent, useEffect, useState } from 'react';

import getViews from 'fetching/views/getViews';
import ZetkinQuery from 'components/ZetkinQuery';


const ViewJumpMenu : FunctionComponent = () => {
    const intl = useIntl();
    const router = useRouter();
    const { orgId, viewId } = router.query;
    const viewsQuery = useQuery(['views', orgId], getViews(orgId as string));
    const [jumpMenuAnchor, setJumpMenuAnchor] = useState<Element | null>(null);
    const {
        getInputProps,
        getListboxProps,
        getRootProps,
        groupedOptions,
        inputValue,
    } = useAutocomplete({
        getOptionLabel: option => option.title,
        options: viewsQuery.data || [],
    });

    useEffect(() => {
        const closeMenu = () => {
            setJumpMenuAnchor(null);
        };

        router.events.on('routeChangeStart', closeMenu);

        return () => {
            router.events.off('routeChangeStart', closeMenu);
        };
    }, [router]);

    // Exclude the current view from the list of views to jump to
    const options = (inputValue.length? groupedOptions : viewsQuery.data || [])
        .filter(view => view.id.toString() != viewId as string);

    return (
        <>
            <IconButton onClick={ (ev) => setJumpMenuAnchor(ev.target as Element) }>
                <ExpandMore/>
            </IconButton>
            <Popover
                anchorEl={ jumpMenuAnchor }
                onClose={ () => setJumpMenuAnchor(null) }
                open={ !!jumpMenuAnchor }
                PaperProps={{
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '40vh',
                        width: '30ch',
                    },
                }}>
                <ZetkinQuery
                    queries={{ viewsQuery }}>
                    <Box { ...getRootProps() } p={ 1 }>
                        <TextField
                            { ...getInputProps() }
                            autoFocus={ true }
                            fullWidth
                            placeholder={ intl.formatMessage({ id: 'pages.people.views.layout.jumpMenu.placeholder' }) }
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                    <List { ...getListboxProps() } dense style={{ overflowY: 'scroll' }}>
                        { options.map((view) => {
                            return (
                                <Link
                                    key={ view.id }
                                    href={{
                                        pathname: `/organize/${orgId}/people/views/${view.id}`,
                                    }}
                                    passHref>
                                    <ListItem button component="a">
                                        <ListItemText>
                                            { view.title }
                                        </ListItemText>
                                    </ListItem>
                                </Link>
                            );
                        }) }
                    </List>
                </ZetkinQuery>
            </Popover>
        </>
    );
};

export default ViewJumpMenu;
