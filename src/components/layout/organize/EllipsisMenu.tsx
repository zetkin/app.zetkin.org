import { MoreVert } from '@material-ui/icons';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';


export interface EllipsisMenuProps {
    items: {
        id?: string;
        label: string;
        onSelect: () => void;
    }[];
}

const EllipsisMenu: FunctionComponent<EllipsisMenuProps> = ({ items }) => {
    const [menuActivator, setMenuActivator] = useState<null | HTMLElement>(null);

    return (
        <>
            <Button
                data-testid="EllipsisMenu-menuActivator"
                disableElevation
                onClick={ (e) => setMenuActivator(e.currentTarget) }>
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

export default EllipsisMenu;
