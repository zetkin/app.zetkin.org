import { forwardRef } from 'react';
import { MenuItem } from '@mui/material';
import {
  GridColDef,
  GridColumnMenuContainer,
  GridColumnMenuFilterItem,
  GridColumnMenuProps,
} from '@mui/x-data-grid-pro';

import { Msg } from 'core/i18n';
import noPropagate from 'utils/noPropagate';
import messageIds from 'features/views/l10n/messageIds';

export type ViewDataTableColumnMenuProps = {
  onConfigure: (colId: string) => void;
  onDelete: (colId: string) => void;
  onRename: (colId: string) => void;
  showConfigureButton: (field: GridColDef['field']) => boolean;
};

const ViewDataTableColumnMenu = forwardRef<
  HTMLUListElement,
  GridColumnMenuProps & ViewDataTableColumnMenuProps
>(function ViewDataTableColumnMenuComponent(props, ref) {
  const { hideMenu, colDef, onConfigure, onDelete, onRename, ...rest } = props;

  return (
    <GridColumnMenuContainer
      ref={ref}
      colDef={colDef}
      data-testid={`grid-filter-column-menu-${colDef.field}`}
      hideMenu={hideMenu}
      {...rest}
    >
      <GridColumnMenuFilterItem colDef={colDef} onClick={hideMenu} />
      <MenuItem
        data-testid={`rename-column-button-${colDef.field}`}
        onClick={noPropagate(() => onRename(colDef.field))}
      >
        <Msg id={messageIds.columnMenu.rename} />
      </MenuItem>
      {
        // Conditionally show configure button only if the column type is configurable
        props.showConfigureButton(colDef.field) && (
          <MenuItem onClick={noPropagate(() => onConfigure(colDef.field))}>
            <Msg id={messageIds.columnMenu.configure} />
          </MenuItem>
        )
      }
      <MenuItem
        data-testid={`delete-column-button-${colDef.field}`}
        onClick={noPropagate(() => onDelete(colDef.field))}
      >
        <Msg id={messageIds.columnMenu.delete} />
      </MenuItem>
    </GridColumnMenuContainer>
  );
});

export default ViewDataTableColumnMenu;
