import { forwardRef } from 'react';
import { MenuItem } from '@mui/material';
import {
  GridColDef,
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridFilterMenuItem,
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
  const { hideMenu, currentColumn, onConfigure, onDelete, onRename, ...rest } =
    props;

  return (
    <GridColumnMenuContainer
      ref={ref}
      currentColumn={currentColumn}
      data-testid={`grid-filter-column-menu-${currentColumn.field}`}
      hideMenu={hideMenu}
      {...rest}
    >
      <GridFilterMenuItem column={currentColumn} onClick={hideMenu} />
      <MenuItem
        data-testid={`rename-column-button-${currentColumn.field}`}
        onClick={noPropagate(() => onRename(currentColumn.field))}
      >
        <Msg id={messageIds.columnMenu.rename} />
      </MenuItem>
      {
        // Conditionally show configure button only if the column type is configurable
        props.showConfigureButton(currentColumn.field) && (
          <MenuItem
            onClick={noPropagate(() => onConfigure(currentColumn.field))}
          >
            <Msg id={messageIds.columnMenu.configure} />
          </MenuItem>
        )
      }
      <MenuItem
        data-testid={`delete-column-button-${currentColumn.field}`}
        onClick={noPropagate(() => onDelete(currentColumn.field))}
      >
        <Msg id={messageIds.columnMenu.delete} />
      </MenuItem>
    </GridColumnMenuContainer>
  );
});

export default ViewDataTableColumnMenu;
