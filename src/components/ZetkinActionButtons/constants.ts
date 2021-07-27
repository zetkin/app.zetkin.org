/**
 * These are the available actions. Name the values
 * in the enum to match the filename in `./actions`.
 *
 * The modules in `./actions` need to export an object `config`
 * and a React functional component `DialogContent`. See
 * `./actions/types.ts` for the expected shape of the data and
 * the `DialogContent` component's base props.
 */
export enum MENU_ITEMS {
    EDIT_TASK = 'editTask',
    DELETE_TASK = 'deleteTask'
}

export enum ACTION_BUTTONS {
    PUBLISH_TASK = 'publishTask'
}

export const MENU_ITEMS_RELATIVE_PATH = './actions/menuItems/';

export const ACTION_BUTTONS_RELATIVE_PATH = './actions/buttons/';
