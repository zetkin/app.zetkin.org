import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { FC, KeyboardEvent } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  MuiEvent,
} from '@mui/x-data-grid-pro';

import compareTags from 'features/tags/utils/compareTags';
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
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<ZetkinViewRow, ZetkinTag>) => {
        if (tag?.value_type !== null) {
          return <ValueTagCell cell={params.value} />;
        } else {
          return (
            <BasicTagCell
              cell={params.value}
              personId={params.row.id}
              tagId={column.config.tag_id}
            />
          );
        }
      },
      sortComparator: (v1: ZetkinTag, v2: ZetkinTag) => {
        return compareTags(v1, v2);
      },
    };
  }

  getSearchableStrings(): string[] {
    return [];
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
}));

interface ValueTagCellProps {
  cell: ZetkinTag | undefined;
}

const ValueTagCell: FC<ValueTagCellProps> = ({ cell }) => {
  if (!cell) {
    return null;
  } else if (cell.value) {
    return <span>{cell.value}</span>;
  } else {
    return (
      <Typography color="secondary" component="span" fontStyle="italic">
        <Msg id={messageIds.cells.personTag.emptyValue} />
      </Typography>
    );
  }
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

  const styles = useStyles();

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
