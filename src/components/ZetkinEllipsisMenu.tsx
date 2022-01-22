import { MoreVert } from '@material-ui/icons';
import { noPropagate } from 'utils';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';


export interface ZetkinEllipsisMenuProps {
    items: {
        id?: string;
        label: string;
        onSelect: () => void;
    }[];
}

const ZetkinEllipsisMenu: FunctionComponent<ZetkinEllipsisMenuProps> = ({ items }) => {
    const [menuActivator, setMenuActivator] = useState<null | HTMLElement>(null);

    return (
        <>
            <Button
                data-testid="EllipsisMenu-menuActivator"
                disableElevation
                onClick={ noPropagate((e) => setMenuActivator(e?.currentTarget as HTMLElement)) }>
                <MoreVert/>
            </Button>
            <Menu
                anchorEl={ menuActivator }
                keepMounted
                onClose={ () => setMenuActivator(null) }
                open={ Boolean(menuActivator) }>
                { items.map((item, idx) => (
                    <MenuItem
                        key={ item.id || idx }
                        data-testid={ `EllipsisMenu-item-${item.id || idx}` }
                        onClick={ () => {
                            item.onSelect();
                            setMenuActivator(null);
                        } }>
                        { item.label }
                    </MenuItem>
                )) }
            </Menu>
        </>
    );
};

export default ZetkinEllipsisMenu;
