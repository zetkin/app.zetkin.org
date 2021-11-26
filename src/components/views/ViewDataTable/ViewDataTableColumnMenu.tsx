import { forwardRef } from 'react';
import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';
import {
    GridColumnMenuContainer,
    GridColumnMenuProps,
    GridColumnsMenuItem,
    GridFilterMenuItem,
    HideGridColMenuItem,
    SortGridMenuItems,
} from '@mui/x-data-grid-pro';

type CustomProps = {
    onDelete: (colId : string) => void;
};

const ViewDataTableColumnMenu = forwardRef<
    HTMLUListElement,
    GridColumnMenuProps & CustomProps
>(function ViewDataTableColumnMenuComponent(props, ref) {
    const { hideMenu, currentColumn, onDelete, ...rest } = props;

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
            <MenuItem onClick={ () => onDelete(currentColumn.field) }>
                <Msg id="misc.views.columnMenu.delete"/>
            </MenuItem>
        </GridColumnMenuContainer>
    );
});

export default ViewDataTableColumnMenu;
