import { Box } from '@mui/material';
import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import TagModel from 'features/tags/models/TagModel';
import useModel from 'core/useModel';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { PersonTagViewColumn, ZetkinViewRow } from '../../types';

export default class PersonTagColumnType implements IColumnType {
  cellToString(cell: ZetkinTag): string {
    return cell.value ? cell.value.toString() : Boolean(cell).toString();
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
    };
  }
}

const useStyles = makeStyles(() => ({
  ghost: {
    pointerEvents: 'none',
  },
  ghostContainer: {
    '&:hover': {
      opacity: 0.3,
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
  const styles = useStyles();

  if (cell?.value) {
    return <>{cell.value}</>;
  } else {
    return (
      <ZUIFuture future={model.getTag()}>
        {(tag) => {
          if (cell) {
            return (
              <TagChip
                onDelete={() => {
                  model.removeFromPerson(personId);
                }}
                tag={tag}
              />
            );
          } else {
            return (
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
            );
          }
        }}
      </ZUIFuture>
    );
  }
};
