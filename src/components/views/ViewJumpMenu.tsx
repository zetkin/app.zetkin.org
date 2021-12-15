import { ExpandMore } from '@material-ui/icons';
import { useAutocomplete } from '@material-ui/lab';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, IconButton, MenuItem, Popover, TextField } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import getViews from 'fetching/views/getViews';
import ZetkinQuery from 'components/ZetkinQuery';
import { ZetkinView } from 'types/views';

interface ViewJumpMenuProps {
    onViewSelect: (view: ZetkinView) => void;
}

const ViewJumpMenu : FunctionComponent<ViewJumpMenuProps> = ({ onViewSelect }) => {
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
                    { ({ queries: { viewsQuery } }) => {
                        const options = inputValue.length? groupedOptions : viewsQuery.data;

                        return (
                            <>
                                <Box { ...getRootProps() }>
                                    <TextField { ...getInputProps() } />
                                </Box>
                                <Box { ...getListboxProps() } style={{ overflowY: 'scroll' }}>
                                    { options.map(view => {
                                        if (view.id.toString() != viewId as string) {
                                            return (
                                                <MenuItem key={ view.id }
                                                    onClick={ () => {
                                                        setJumpMenuAnchor(null);
                                                        onViewSelect(view);
                                                    } }>
                                                    { view.title }
                                                </MenuItem>
                                            );
                                        }
                                    }) }
                                </Box>
                            </>
                        );
                    } }
                </ZetkinQuery>
            </Popover>
        </>
    );
};

export default ViewJumpMenu;
