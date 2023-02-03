import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';
import { useRouter } from 'next/router';

import { IColumnType } from '.';
import { PersonTagViewColumn } from '../../types';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import TagModel from 'features/tags/models/TagModel';
import useModel from 'core/useModel';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';

export default class PersonTagColumnType implements IColumnType {
  cellToString(cell: ZetkinTag): string {
    return cell.value ? cell.value.toString() : Boolean(cell).toString();
  }

  getColDef(column: PersonTagViewColumn): Omit<GridColDef, 'field'> {
    return {
      renderCell: (params) => {
        return <Cell cell={params.value} tagId={column.config.tag_id} />;
      },
    };
  }
}

const Cell: FC<{ cell: ZetkinTag | null; tagId: number }> = ({
  cell,
  tagId,
}) => {
  // TODO: Find a way to share a model between cells in a column
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);
  const model = useModel((env) => new TagModel(env, orgId, tagId));

  if (!cell) {
    return null;
  } else if (cell.value) {
    return <>{cell.value}</>;
  } else {
    return (
      <ZUIFuture future={model.getTag()}>
        {(tag) => {
          return <TagChip tag={tag} />;
        }}
      </ZUIFuture>
    );
  }
};
