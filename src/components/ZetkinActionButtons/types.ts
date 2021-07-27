import { MENU_ITEMS } from './constants';

export interface MenuItemConfig {
    icon: React.ReactNode;
    label: string;
    key: MENU_ITEMS;
}

export interface MenuItemAction {
    config: MenuItemConfig;
}
