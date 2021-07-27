/* eslint-disable react-hooks/exhaustive-deps */
import { Settings } from '@material-ui/icons';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';

import ZetkinDialog from 'components/ZetkinDialog';

import { MenuItemConfig } from './types';
import { ACTION_BUTTONS, MENU_ITEMS } from './constants';


interface ZetkinActionsButtonProps {
    actionButtons?: ACTION_BUTTONS[];
    menuItems?: MENU_ITEMS[];
}

const ZetkinActionButtons: React.FunctionComponent<ZetkinActionsButtonProps> = ({ menuItems: menuItemsKeys }) => {
    const intl = useIntl();
    // Menu
    const [menuActivator, setMenuActivator] = React.useState<null | HTMLElement>(null);
    const [menuItems, setMenuItems] = useState<MenuItemConfig[]>();
    // Dialogs
    const [currentOpenDialog, setCurrentOpenDialog] = useState<ACTION_BUTTONS | MENU_ITEMS>();

    useEffect(() => {
        // Import the menu items specified in props
        if (menuItemsKeys) {
            const importMenuItems = async () => {
                const importedMenuItems = await Promise.all(menuItemsKeys.map(async (menuItem) => {
                    const { default: config }: {default: MenuItemConfig} = await import(`./actions/menuItems/${menuItem}.tsx`);
                    return config;
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
                        { menuItems.map((config) => (
                            <MenuItem
                                key={ config.key }
                                onClick={ () => {
                                    setMenuActivator(null);
                                    setCurrentOpenDialog(config.key);
                                } }>
                                <Box mr={ 1 }>{ config.icon }</Box>
                                <Msg id={ config.label } />
                            </MenuItem>
                        )) }
                    </Menu>
                    { menuItems.map(menuItemConfig => (
                        <ZetkinDialog
                            key={ menuItemConfig.key }
                            onClose={ () => setCurrentOpenDialog(undefined) }
                            open={ currentOpenDialog === menuItemConfig.key }
                            title={ intl.formatMessage({ id: menuItemConfig.label }) }>
                            { menuItemConfig.dialogContents }
                        </ZetkinDialog>
                    )) }
                </>
            )
            }
        </>
    );
};

export default ZetkinActionButtons;

export { ACTION_BUTTONS, MENU_ITEMS };
