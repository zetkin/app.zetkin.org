import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import {
  Box,
  lighten,
  TextField,
  TextFieldProps,
  Theme,
  Typography,
} from '@mui/material';
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
import { IColumnType } from '.';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import messageIds from 'features/views/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useTag from 'features/tags/hooks/useTag';
import useTagging from 'features/tags/hooks/useTagging';
import { UseViewGridReturn } from 'features/views/hooks/useViewGrid';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { AppDispatch, RootState } from 'core/store';
import { PersonTagViewColumn, ZetkinViewRow } from '../../types';
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

    const tag = tagFuture.data;

    return {
      align: 'center',
      editable: !accessLevel && tag?.value_type !== null,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<ZetkinViewRow, ZetkinTag>) => {
        if (!tag) {
          return null;
        } else if (tag.value_type !== null) {
          return <ValueTagCell tag={params.value} tagColor={tag.color} />;
        } else {
          return (
            <BasicTagCell
              cell={params.value}
              personId={params.row.id}
              tagId={tag.id}
            />
          );
        }
      },
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

const useStyles = makeStyles<Theme, { tagColor?: string | null }>(() => ({
  emptyValueTagCell: {
    '&:hover': {
      opacity: 0.4,
    },
    backgroundColor: ({ tagColor }) =>
      lighten(tagColor || DEFAULT_TAG_COLOR, 0.7),
    borderLeft: ({ tagColor }) => `4px solid ${tagColor || DEFAULT_TAG_COLOR}`,
    height: '100%',
    opacity: 0,
    width: '100%',
  },
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
  valueTagCell: {
    alignItems: 'center',
    backgroundColor: ({ tagColor }) =>
      lighten(tagColor || DEFAULT_TAG_COLOR, 0.7),
    borderLeft: ({ tagColor }) => `4px solid ${tagColor || DEFAULT_TAG_COLOR}`,
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  valueTagCellText: {
    maxWidth: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  valueTagEditCell: {
    backgroundColor: ({ tagColor }) =>
      lighten(tagColor || DEFAULT_TAG_COLOR, 0.7),
  },
}));

const EmptyValue = ({ tagColor }: { tagColor: string | null }) => {
  const classes = useStyles({ tagColor });
  return (
    <Box className={classes.valueTagCell}>
      <Typography
        className={classes.valueTagCellText}
        color="secondary"
        fontStyle="italic"
      >
        <Msg id={messageIds.cells.personTag.emptyValue} />
      </Typography>
    </Box>
  );
};

interface ValueTagCellProps {
  tagColor: string | null;
  tag: ZetkinTag | undefined;
}

const ValueTagCell: FC<ValueTagCellProps> = ({ tagColor, tag }) => {
  const classes = useStyles({ tagColor });

  if (!tag) {
    return <Box className={classes.emptyValueTagCell} />;
  } else if (tag.value) {
    //The tag value could be an empty string, if so we show "Empty value"
    const valueIsEmptyString = !tag.value.toString().trim().length;

    return valueIsEmptyString ? (
      <EmptyValue tagColor={tagColor} />
    ) : (
      <Box className={classes.valueTagCell}>
        <Typography className={classes.valueTagCellText}>
          {tag.value}
        </Typography>
      </Box>
    );
  } else {
    return <EmptyValue tagColor={tagColor} />;
  }
};

const ValueTagEditCell = (
  props: GridRenderEditCellParams<ZetkinViewRow> & { tagColor?: string | null }
) => {
  const { field, id, tagColor } = props;
  const tag: ZetkinTag | null = props.value;
  const apiRef = useGridApiContext();
  const classes = useStyles({ tagColor });

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
      className={classes.valueTagEditCell}
      fullWidth
      inputRef={handleTextFieldRef}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
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
