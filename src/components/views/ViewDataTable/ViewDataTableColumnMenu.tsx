import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';
import { forwardRef, MouseEventHandler } from 'react';
import {
    GridColumnMenuContainer,
    GridColumnMenuProps,
    GridFilterMenuItem,
} from '@mui/x-data-grid-pro';

type CustomProps = {
    onConfigure: (colId : string) => void;
    onDelete: (colId : string) => void;
    onRename: (colId : string) => void;
};

const ViewDataTableColumnMenu = forwardRef<
    HTMLUListElement,
    GridColumnMenuProps & CustomProps
>(function ViewDataTableColumnMenuComponent(props, ref) {
    const { hideMenu, currentColumn, onConfigure, onDelete, onRename, ...rest } = props;

    const onClickRename : MouseEventHandler = (ev) => {
        ev.stopPropagation();
        onRename(currentColumn.field);
    };

    const onClickConfigure : MouseEventHandler = (ev) => {
        ev.stopPropagation();
        onConfigure(currentColumn.field);
    };

    const onClickDelete : MouseEventHandler = (ev) => {
        ev.stopPropagation();
        onDelete(currentColumn.field);
    };

    return (
        <GridColumnMenuContainer
            ref={ ref }
            currentColumn={ currentColumn }
            hideMenu={ hideMenu }
            { ...rest }>
            <GridFilterMenuItem column={ currentColumn } onClick={ hideMenu } />
            <MenuItem onClick={ onClickRename }>
                <Msg id="misc.views.columnMenu.rename"/>
            </MenuItem>
            <MenuItem onClick={ onClickConfigure }>
                <Msg id="misc.views.columnMenu.configure"/>
            </MenuItem>
            <MenuItem onClick={ onClickDelete }>
                <Msg id="misc.views.columnMenu.delete"/>
            </MenuItem>
        </GridColumnMenuContainer>
    );
});

export default ViewDataTableColumnMenu;
