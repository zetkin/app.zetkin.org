import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';
import { useRouter } from 'next/router';

import { IColumnType } from '.';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

type LocalPersonViewCell = null | {
  first_name: string;
  id: number;
  last_name: string;
};

export default class LocalPersonColumnType implements IColumnType {
  cellToString(cell: ZetkinPerson): string {
    return `${cell.first_name} ${cell.last_name}`;
  }
  getColDef(): Omit<GridColDef, 'field'> {
    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return <Cell cell={params.value} />;
      },
    };
  }
}

const Cell: FC<{ cell: LocalPersonViewCell }> = ({ cell }) => {
  const { orgId } = useRouter().query;
  return cell ? (
    <ZUIAvatar orgId={parseInt(orgId as string)} personId={cell.id} />
  ) : null;
};
