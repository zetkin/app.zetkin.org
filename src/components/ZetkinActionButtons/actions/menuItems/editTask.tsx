import { Edit } from '@material-ui/icons';

import { MENU_ITEMS } from '../../constants';
import { MenuItemConfig } from '../../types';

const config = {
    icon: <Edit />,
    key: MENU_ITEMS.EDIT_TASK,
    label: 'misc.tasks.forms.editTask.title',
} as MenuItemConfig;

export {
    config,
};
