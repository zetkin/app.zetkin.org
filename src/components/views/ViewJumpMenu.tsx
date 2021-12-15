import { ExpandMore } from '@material-ui/icons';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';

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

    return (
        <>
            <IconButton onClick={ (ev) => setJumpMenuAnchor(ev.target as Element) }>
                <ExpandMore/>
            </IconButton>
            <Menu
                anchorEl={ jumpMenuAnchor }
                onClose={ () => setJumpMenuAnchor(null) }
                open={ !!jumpMenuAnchor }
                PaperProps={{
                    style: {
                        maxHeight: '40vh',
                    },
                }}>
                <ZetkinQuery
                    queries={{ viewsQuery }}>
                    { ({ queries: { viewsQuery } }) => {
                        return viewsQuery.data.map(view => {
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
                        });
                    } }
                </ZetkinQuery>
            </Menu>
        </>
    );
};

export default ViewJumpMenu;
