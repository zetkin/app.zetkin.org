import { Box, InputBase, InputBaseProps, Paper, Popper } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import {
  GridColDef,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import { UseViewGridReturn } from 'features/views/hooks/useViewGrid';
import { ZetkinObjectAccess } from 'core/api/types';
import { LocalTextViewColumn, ZetkinViewRow } from '../../types';

type LocalTextViewCell = string | null;

export default class LocalTextColumnType implements IColumnType {
  cellToString(cell: LocalTextViewCell): string {
    return cell ? cell : '';
  }
  getColDef(
    column: LocalTextViewColumn,
    accessLevel: ZetkinObjectAccess['level'] | null
  ): Omit<GridColDef, 'field'> {
    return {
      /* 
        Important trade-off:
        Our goal is to show a resizable textarea even in read-only mode.

        We are going against MUI's semantics here, setting `editable` to `true`, 
        because we want to leverage MUI's built-in user interaction handlers (and styles).

        We guarantee that the accessLevel is respected, 
        by overwriting the `isEditable` prop of the Textarea component directly.
      */
      editable: true,
      renderCell: (params) => <Cell cell={params.value} />,
      renderEditCell: (params) => (
        <Textarea {...params} isEditable={accessLevel != 'readonly'} />
      ),
      width: 250,
    };
  }
  getSearchableStrings(cell: LocalTextViewCell): string[] {
    return cell ? [cell] : [];
  }
  processRowUpdate(
    viewGrid: UseViewGridReturn,
    col: LocalTextViewColumn,
    personId: number,
    data: LocalTextViewCell
  ): void {
    viewGrid.setCellValue(personId, col.id, data);
  }
}

const Cell: FC<{ cell: LocalTextViewCell | undefined }> = ({ cell }) => {
  if (!cell) {
    return null;
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
      }}
    >
      <Box
        sx={{
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          display: '-webkit-box',
          maxHeight: '100%',
          overflow: 'hidden',
          whiteSpace: 'normal',
          width: '100%',
        }}
      >
        {cell}
      </Box>
    </Box>
  );
};

const Textarea = (props: GridRenderEditCellParams<ZetkinViewRow>) => {
  const { id, field, value, colDef } = props;
  const [valueState, setValueState] = useState(value);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const apiRef = useGridApiContext();

  const handleTextAreaRef = useCallback((el: HTMLTextAreaElement | null) => {
    if (el) {
      if (!props.isEditable) {
        return;
      }
      // When entering edit mode, focus the text area and put
      // caret at the end of the text
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const handleRef = useCallback((el: HTMLElement | null) => {
    setAnchorEl(el);
  }, []);

  const handleChange = useCallback<NonNullable<InputBaseProps['onChange']>>(
    (event) => {
      if (!props.isEditable) {
        return;
      }
      const newValue = event.target.value;
      setValueState(newValue);
      apiRef.current.setEditCellValue(
        { debounceMs: 200, field, id, value: newValue },
        event
      );
    },
    [apiRef, field, id]
  );

  const handleKeyDown = useCallback<NonNullable<InputBaseProps['onKeyDown']>>(
    (event) => {
      // allow adding newlines without submission
      if (event.key === 'Enter' && event.shiftKey) {
        event.stopPropagation();
      }
    },
    [apiRef, id, field]
  );

  return (
    <div style={{ alignSelf: 'flex-start', position: 'relative' }}>
      <div
        ref={handleRef}
        style={{
          display: 'block',
          height: 1,
          position: 'absolute',
          top: 0,
          width: colDef.computedWidth,
        }}
      />
      {anchorEl && (
        <Popper anchorEl={anchorEl} open placement="bottom-start">
          <Paper elevation={1} sx={{ minWidth: colDef.computedWidth, p: 1 }}>
            <InputBase
              disabled={!props.isEditable}
              inputRef={handleTextAreaRef}
              multiline
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              readOnly={!props.isEditable}
              rows={4}
              sx={{ textarea: { resize: 'both' }, width: '100%' }}
              value={valueState}
            />
          </Paper>
        </Popper>
      )}
    </div>
  );
};
