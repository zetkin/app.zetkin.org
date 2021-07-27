import { Edit } from '@material-ui/icons';

import { MENU_ITEMS } from '../../constants';
import { MenuItemConfig } from '../../types';

const DialogContents = () => {
    return (
        <div>Hewwo</div>
    );
};

const config = {
    dialogContents: DialogContents,
    icon: <Edit />,
    key: MENU_ITEMS.EDIT_TASK,
    label: 'misc.tasks.forms.editTask.title',
};

export default config as MenuItemConfig;
