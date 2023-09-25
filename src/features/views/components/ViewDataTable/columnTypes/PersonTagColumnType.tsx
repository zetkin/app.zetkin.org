import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { FC, KeyboardEvent } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  MuiEvent,
} from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import TagModel from 'features/tags/models/TagModel';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useModel from 'core/useModel';
import useTag from 'features/tags/hooks/useTag';
import ViewDataModel from 'features/views/models/ViewDataModel';
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
      renderCell: (params: GridRenderCellParams<ZetkinTag, ZetkinViewRow>) => {
        return (
          <Cell
            cell={params.value}
            personId={params.row.id}
            tagId={column.config.tag_id}
          />
        );
      },
      sortComparator: (v1: ZetkinTag, v2: ZetkinTag) => {
        // TODO: simplify code when v1.value, v2.value can't be null
        //if v1 or v1.value is null and v2 or v2.value is null then it should return 0 otherwise v1(null) should be placed before v2(value)
        if (!v1 || !v1.value) {
          return !v2 || !v2.value ? 0 : -1;
        }
        //if v2 or v2.value is null then v1(value) should be placed after v2(null)
        if (!v2 || !v2.value) {
          return 1;
        }

        if (typeof v1.value === 'string' && typeof v2.value === 'string') {
          if (isNaN(Number(v1.value)) && isNaN(Number(v2.value))) {
            return v1.value.localeCompare(v2.value);
          }
          if (!isNaN(Number(v1.value)) && !isNaN(Number(v2.value))) {
            return parseInt(v1.value) - parseInt(v2.value);
          }
          if (isNaN(Number(v1.value))) {
            return 1;
          }
          if (isNaN(Number(v2.value))) {
            return -1;
          } else {
            return v1.value.localeCompare(v2.value);
          }
        }

        if (typeof v1.value === 'number' && typeof v2.value === 'number') {
          return v1.value - v2.value;
        }
        return 0;
      },
    };
  }

  getSearchableStrings(): string[] {
    return [];
  }

  handleKeyDown(
    model: ViewDataModel,
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
      model.toggleTag(personId, column.config.tag_id, !data);
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
  const model = useModel((env) => new TagModel(env, orgId, tagId));
  const { getTag, removeFromPerson } = useTag(orgId, tagId);
  const styles = useStyles();

  const [isRestricted] = useAccessLevel();

  if (cell?.value_type != null) {
    return <>{cell.value}</>;
  } else if (cell) {
    return (
      <TagChip
        onDelete={() => {
          removeFromPerson(personId);
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
        <ZUIFuture future={getTag()}>
          {(tag) => (
            <Box
              className={styles.ghostContainer}
              onClick={() => {
                model.assignToPerson(personId);
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
