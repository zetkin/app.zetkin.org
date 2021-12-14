import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';
import { forwardRef, MouseEventHandler } from 'react';
import {
    GridColDef,
    GridColumnMenuContainer,
    GridColumnMenuProps,
    GridFilterMenuItem,
} from '@mui/x-data-grid-pro';

export type ViewDataTableColumnMenuProps = {
    onConfigure: (colId : string) => void;
    onDelete: (colId : string) => void;
    onRename: (colId : string) => void;
    showConfigureButton: (field: GridColDef['field']) => boolean;
};

const ViewDataTableColumnMenu = forwardRef<
    HTMLUListElement,
    GridColumnMenuProps & ViewDataTableColumnMenuProps
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
            data-testid={ `grid-filter-column-menu-${currentColumn.field}` }
            hideMenu={ hideMenu }
            { ...rest }>
            <GridFilterMenuItem column={ currentColumn } onClick={ hideMenu } />
            <MenuItem data-testid={ `rename-column-button-${currentColumn.field}` } onClick={ onClickRename }>
                <Msg id="misc.views.columnMenu.rename"/>
            </MenuItem>
            {
                // Conditionally show configure button only if the column type is configurable
                props.showConfigureButton(currentColumn.field) && (
                    <MenuItem onClick={ onClickConfigure }>
                        <Msg id="misc.views.columnMenu.configure"/>
                    </MenuItem>
                )
            }
            <MenuItem data-testid={ `delete-column-button-${currentColumn.field}` } onClick={ onClickDelete }>
                <Msg id="misc.views.columnMenu.delete"/>
            </MenuItem>
        </GridColumnMenuContainer>
    );
});

export default ViewDataTableColumnMenu;
