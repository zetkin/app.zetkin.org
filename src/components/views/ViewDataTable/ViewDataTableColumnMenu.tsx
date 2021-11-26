import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';
import { forwardRef, MouseEventHandler } from 'react';
import {
    GridColumnMenuContainer,
    GridColumnMenuProps,
    GridColumnsMenuItem,
    GridFilterMenuItem,
    HideGridColMenuItem,
    SortGridMenuItems,
} from '@mui/x-data-grid-pro';

type CustomProps = {
    onConfigure: (colId : string) => void;
    onDelete: (colId : string) => void;
};

const ViewDataTableColumnMenu = forwardRef<
    HTMLUListElement,
    GridColumnMenuProps & CustomProps
>(function ViewDataTableColumnMenuComponent(props, ref) {
    const { hideMenu, currentColumn, onConfigure, onDelete, ...rest } = props;

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
            <SortGridMenuItems column={ currentColumn } onClick={ hideMenu }/>
            <GridFilterMenuItem column={ currentColumn } onClick={ hideMenu } />
            <HideGridColMenuItem column={ currentColumn } onClick={ hideMenu } />
            <GridColumnsMenuItem column={ currentColumn } onClick={ hideMenu } />
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
