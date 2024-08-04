import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { FC, KeyboardEvent } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  MuiEvent,
} from '@mui/x-data-grid-pro';

import compareTags from 'features/tags/utils/compareTags';
import { IColumnType } from '.';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useTag from 'features/tags/hooks/useTag';
import useTagging from 'features/tags/hooks/useTagging';
import { UseViewGridReturn } from 'features/views/hooks/useViewGrid';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { PersonTagViewColumn, ZetkinViewRow } from '../../types';

type PersonTagViewCell = null | {
  value?: string;
};

export default class PersonTagColumnType implements IColumnType {
  cellToString(cell: PersonTagViewCell): string {
    return cell?.value ? cell.value.toString() : Boolean(cell).toString();
  }

  getColDef(column: PersonTagViewColumn): Omit<GridColDef, 'field'> {
    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<ZetkinViewRow, ZetkinTag>) => {
        return (
          <Cell
            cell={params.value}
            personId={params.row.id}
            tagId={column.config.tag_id}
          />
        );
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

const Cell: FC<{
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

  if (cell?.value_type != null) {
    return <span>{cell.value}</span>;
  } else if (cell) {
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
