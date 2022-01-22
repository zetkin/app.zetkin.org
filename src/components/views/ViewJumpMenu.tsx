/* eslint-disable jsx-a11y/no-autofocus */

import { ExpandMore } from '@material-ui/icons';
import Link from 'next/link';
import { useAutocomplete } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, IconButton, List, ListItem, ListItemText, Popover, TextField } from '@material-ui/core';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { viewsResource } from 'api/views';
import ZetkinQuery from 'components/ZetkinQuery';


const ViewJumpMenu : FunctionComponent = () => {
    const intl = useIntl();
    const listRef = useRef<HTMLUListElement>(null);
    const router = useRouter();
    const { orgId, viewId } = router.query;
    const viewsQuery = viewsResource(orgId as string).useQuery();
    const [jumpMenuAnchor, setJumpMenuAnchor] = useState<Element | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(Infinity);
    const {
        getInputProps,
        getListboxProps,
        getRootProps,
        groupedOptions,
        inputValue,
    } = useAutocomplete({
        clearOnBlur: true,
        getOptionLabel: option => option.title,
        options: viewsQuery.data || [],
    });

    // Set up event listeners to close menu when navigating away
    useEffect(() => {
        const closeMenu = () => {
            setJumpMenuAnchor(null);
        };

        router.events.on('routeChangeStart', closeMenu);

        return () => {
            router.events.off('routeChangeStart', closeMenu);
        };
    }, [router]);

    // Scroll (if necessary) when navigating using keyboard
    useEffect(() => {
        const listElem = listRef.current;
        if (listElem) {
            const bottomOffset = listElem.scrollTop + listElem.clientHeight;
            const itemElem = listElem.children[activeIndex] as HTMLElement;
            if ((itemElem?.offsetTop + itemElem?.clientHeight * 2) > bottomOffset) {
                listElem.scrollTop = (itemElem.offsetTop - listElem.clientHeight) + 2 * itemElem.clientHeight;
            }
            else if (itemElem?.offsetTop < listElem.scrollTop) {
                listElem.scrollTop = itemElem.offsetTop - itemElem.clientHeight;
            }
        }
    }, [listRef, activeIndex]);

    // Exclude the current view from the list of views to jump to
    const options = (inputValue.length? groupedOptions : viewsQuery.data || [])
        .filter(view => view.id.toString() != viewId as string);

    return (
        <>
            <IconButton
                data-testid="view-jump-menu-button"
                onClick={ (ev) => setJumpMenuAnchor(ev.target as Element) }>
                <ExpandMore/>
            </IconButton>
            <Popover
                anchorEl={ jumpMenuAnchor }
                data-testid="view-jump-menu-popover"
                onClose={ () => setJumpMenuAnchor(null) }
                onKeyDown={ ev => {
                    if (ev.code == 'ArrowUp') {
                        const nextIndex = activeIndex - 1;
                        setActiveIndex(nextIndex >= 0? nextIndex : options.length - 1);
                    }
                    else if (ev.code == 'ArrowDown') {
                        const nextIndex = activeIndex + 1;
                        setActiveIndex(nextIndex < options.length? nextIndex : 0);
                    }
                    else if (ev.code == 'Enter') {
                        const selectedView = options[activeIndex];
                        if (selectedView) {
                            setJumpMenuAnchor(null);
                            setActiveIndex(Infinity);
                            router.push(`/organize/${orgId}/people/views/${selectedView.id}`);
                            ev.preventDefault();
                        }
                    }
                } }
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
                    <List { ...getListboxProps() } ref={ listRef } dense style={{ overflowY: 'scroll' }}>
                        { options.map((view, idx) => {
                            return (
                                <Link
                                    key={ view.id }
                                    href={{
                                        pathname: `/organize/${orgId}/people/views/${view.id}`,
                                    }}
                                    passHref>
                                    <ListItem button component="a" selected={ idx == activeIndex } tabIndex={ -1 }>
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
