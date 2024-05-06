import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { Box, lighten, TextField, TextFieldProps } from '@mui/material';
import { FC, KeyboardEvent, useCallback, useState } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  MuiEvent,
  useGridApiContext,
} from '@mui/x-data-grid-pro';

import compareTags from 'features/tags/utils/compareTags';
import { DEFAULT_TAG_COLOR } from 'features/tags/components/TagManager/utils';
import IApiClient from 'core/api/client/IApiClient';
import { IColumnType } from '../';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useTag from 'features/tags/hooks/useTag';
import useTagging from 'features/tags/hooks/useTagging';
import { UseViewGridReturn } from 'features/views/hooks/useViewGrid';
import ValueTagCell from './ValueTagCell';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { AppDispatch, RootState } from 'core/store';
import { PersonTagViewColumn, ZetkinViewRow } from '../../../types';
import { tagLoad, tagLoaded } from 'features/tags/store';

type PersonTagViewCell = null | {
  value?: string;
};

export default class PersonTagColumnType implements IColumnType {
  cellToString(cell: PersonTagViewCell): string {
    return cell?.value ? cell.value.toString() : Boolean(cell).toString();
  }

  getColDef(
    column: PersonTagViewColumn,
    accessLevel: ZetkinObjectAccess['level'],
    state: RootState,
    apiClient: IApiClient,
    dispatch: AppDispatch,
    orgId: number
  ): Omit<GridColDef, 'field'> {
    const tagId = column.config.tag_id;

    const tagList = state.tags.tagList;
    const tagItem = tagList.items.find((item) => item.id == tagId);

    const tagFuture = loadItemIfNecessary(tagItem, dispatch, {
      actionOnLoad: () => tagLoad(tagId),
      actionOnSuccess: (tag) => tagLoaded(tag),
      loader: () =>
        apiClient.get<ZetkinTag>(`/api/orgs/${orgId}/people/tags/${tagId}`),
    });

    const tag = !accessLevel ? tagFuture.data : null;

    return {
      align: 'center',
      editable: !accessLevel && tag?.value_type !== null,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<ZetkinViewRow, ZetkinTag>) => (
        <Cell
          cellValue={params.value}
          personId={params.row.id}
          tag={tag || params.value}
        />
      ),
      renderEditCell: (params) => (
        <ValueTagEditCell tagColor={tag?.color} {...params} />
      ),
      sortComparator: (v1: ZetkinTag, v2: ZetkinTag) => {
        return compareTags(v1, v2);
      },
    };
  }

  getSearchableStrings(cell: PersonTagViewCell): string[] {
    return cell?.value ? [cell.value] : [];
  }

  handleKeyDown(
    viewGrid: UseViewGridReturn,
    column: PersonTagViewColumn,
    personId: number,
    data: PersonTagViewCell,
    ev: MuiEvent<KeyboardEvent<HTMLElement>>,
    accessLevel: ZetkinObjectAccess['level']
  ): void {
    if (accessLevel) {
      // Any non-null value means we're in restricted mode
      return;
    }

    if (ev.key == 'Enter' || ev.key == ' ') {
      viewGrid.toggleTag(personId, column.config.tag_id, !data);
      ev.defaultMuiPrevented = true;
    }
  }

  processRowUpdate(
    viewGrid: UseViewGridReturn,
    col: PersonTagViewColumn,
    personId: number,
    data: string | undefined
  ): void {
    viewGrid.toggleTag(personId, col.config.tag_id, !!data, data);
  }
}

const useStyles = makeStyles(() => ({
  ghost: {
    pointerEvents: 'none',
  },
  ghostContainer: {
    '&:hover': {
      opacity: 0.4,
    },
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.1s',
  },
  valueTagEditCell: {},
}));

interface CellProps {
  cellValue: ZetkinTag | undefined;
  personId: number;
  tag?: ZetkinTag | null;
}

const Cell: FC<CellProps> = ({ cellValue, personId, tag }) => {
  if (!tag) {
    return <span>{cellValue?.value || ''}</span>;
  } else if (tag.value_type !== null) {
    if (!cellValue) {
      return (
        <Box
          sx={{
            '&:hover': {
              opacity: 0.4,
            },
            backgroundColor: lighten(tag.color || DEFAULT_TAG_COLOR, 0.7),
            borderLeft: `4px solid ${tag.color || DEFAULT_TAG_COLOR}`,
            height: '100%',
            opacity: 0,
            transition: 'opacity 0.1s',
            width: '100%',
          }}
        />
      );
    } else {
      return <ValueTagCell tag={cellValue} />;
    }
  } else {
    return <BasicTagCell cell={cellValue} personId={personId} tagId={tag.id} />;
  }
};

const ValueTagEditCell = (
  props: GridRenderEditCellParams<ZetkinViewRow> & { tagColor?: string | null }
) => {
  const { field, id, tagColor } = props;
  const tag: ZetkinTag | null = props.value;
  const apiRef = useGridApiContext();

  const [valueState, setValueState] = useState(tag?.value || '');

  const handleTextFieldRef = useCallback((el: HTMLTextAreaElement | null) => {
    if (el) {
      // When entering edit mode, focus the text area and put
      // caret at the end of the text
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const handleChange = useCallback<NonNullable<TextFieldProps['onChange']>>(
    (event) => {
      const newValue = event.target.value;
      setValueState(newValue);
      apiRef.current.setEditCellValue(
        { debounceMs: 200, field, id, value: newValue },
        event
      );
    },
    [apiRef, field, id]
  );

  const handleKeyDown = useCallback<NonNullable<TextFieldProps['onKeyDown']>>(
    (event) => {
      if (
        event.key === 'Escape' ||
        (event.key === 'Enter' &&
          !event.shiftKey &&
          !event.ctrlKey &&
          !event.metaKey)
      ) {
        const params = apiRef.current.getCellParams(id, field);
        apiRef.current.publishEvent('cellKeyDown', params, event);
      }
    },
    [apiRef, id, field]
  );

  return (
    <TextField
      fullWidth
      inputRef={handleTextFieldRef}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      sx={{
        backgroundColor: lighten(tagColor || DEFAULT_TAG_COLOR, 0.7),
      }}
      value={valueState}
    />
  );
};

const BasicTagCell: FC<{
  cell: ZetkinTag | undefined;
  personId: number;
  tagId: number;
}> = ({ cell, personId, tagId }) => {
  // TODO: Find a way to share a model between cells in a column
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);
  const { tagFuture } = useTag(orgId, tagId);
  const { assignToPerson, removeFromPerson } = useTagging(orgId);

  const styles = useStyles({});

  const [isRestricted] = useAccessLevel();

  if (cell) {
    return (
      <TagChip
        onDelete={() => {
          removeFromPerson(personId, tagId);
        }}
        tag={cell}
      />
    );
  } else {
    if (!isRestricted) {
      // Only render "ghost" tag in full-access (non-restricted) mode, as it's
      // likely that a user in restricted mode will not have access to assign
      // (or even retrieve) the tag.
      return (
        <ZUIFuture future={tagFuture}>
          {(tag) => (
            <Box
              className={styles.ghostContainer}
              onClick={() => {
                assignToPerson(personId, tagId);
              }}
            >
              <Box className={styles.ghost}>
                <TagChip tag={tag} />
              </Box>
            </Box>
          )}
        </ZUIFuture>
      );
    }

    return null;
  }
};
