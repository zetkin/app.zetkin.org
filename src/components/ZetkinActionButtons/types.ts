import { MENU_ITEMS } from './constants';

export interface DialogContentBaseProps {
    closeDialog: () => void;
}

export interface MenuItemConfig {
    dialogContents: (...args: unknown[]) => JSX.Element;
    icon: JSX.Element;
    label: string;
    key: MENU_ITEMS;
}
