/* eslint-disable react-hooks/exhaustive-deps */
import { FormattedMessage as Msg } from 'react-intl';
import { Settings } from '@material-ui/icons';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

// import { Action } from './types';
// import ZetkinDialog from 'components/ZetkinDialog';

import { MenuItemAction } from './types';
import { ACTION_BUTTONS, MENU_ITEMS } from './constants';

// type DialogsOpenState = {[key in ACTIONS]?: boolean};

interface ZetkinSpeedDialProps {
    actionButtons?: ACTION_BUTTONS[];
    menuItems?: MENU_ITEMS[];
}

const ZetkinSpeedDial: React.FunctionComponent<ZetkinSpeedDialProps> = ({ menuItems: menuItemsKeys }) => {
    // Menu
    const [menuActivator, setMenuActivator] = React.useState<null | HTMLElement>(null);
    const [menuItems, setMenuItems] = useState<MenuItemAction[]>();

    useEffect(() => {
        // Import the menu items specified in props
        if (menuItemsKeys) {
            const importMenuItems = async () => {
                const importedMenuItems = await Promise.all(menuItemsKeys.map(async (menuItem) => {
                    const { config } = await import(`./actions/menuItems/${menuItem}.tsx`);
                    return {
                        config,
                    };
                }));
                setMenuItems(importedMenuItems);
            };
            importMenuItems();
        }
    }, []);

    return (
        <>
            { /* Menu */ }
            { menuItems && (
                <>
                    <Button color="secondary" disableElevation onClick={ (e) => setMenuActivator(e.currentTarget) } variant="contained">
                        <Settings />
                    </Button>
                    <Menu
                        anchorEl={ menuActivator }
                        keepMounted
                        onClose={ () => setMenuActivator(null) }
                        open={ Boolean(menuActivator) }>
                        { menuItems.map(({ config }) => (
                            <MenuItem
                                key={ config.key }>
                                <Box mr={ 1 }>{ config.icon }</Box>
                                <Msg id={ config.label } />
                            </MenuItem>
                        )) }
                    </Menu>
                </>
            )
            }

        </>
    );
};

export default ZetkinSpeedDial;

export { ACTION_BUTTONS, MENU_ITEMS };
