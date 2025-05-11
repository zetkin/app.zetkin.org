import { FC } from 'react';
import { useRouter } from 'next/router';
import {
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import { IFuture } from 'core/caching/futures';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ZUIPersonGridCell from 'zui/ZUIPersonGridCell';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';
import {
  COLUMN_TYPE,
  LocalPersonViewColumn,
  ZetkinViewColumn,
} from '../../types';
import { ZetkinPerson, ZetkinViewRow } from 'utils/types/zetkin';
import messageIds from 'features/views/l10n/messageIds';
import { useMessages } from 'core/i18n';

type LocalPersonViewCell = null | ZetkinPerson;

const makeName = (cell: { first_name: string; last_name: string }) =>
  `${cell.first_name} ${cell.last_name}`;

export default class LocalPersonColumnType
  implements IColumnType<LocalPersonViewColumn, LocalPersonViewCell>
{
  cellToString(cell: LocalPersonViewCell): string {
    return cell ? makeName(cell) : '';
  }
  getColDef(
    col: LocalPersonViewColumn
  ): Omit<GridColDef<ZetkinViewRow>, 'field'> {
    return {
      align: 'center',
      editable: true,
      filterable: true,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return <ZUIPersonGridCell person={params.value} />;
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return <EditCell cell={params.value} column={col} row={params.row} />;
      },
      sortComparator: (v1, v2) => {
        if (!v1) {
          return 1;
        }
        if (!v2) {
          return -1;
        }
        return makeName(v1).localeCompare(makeName(v2));
      },
      valueGetter: (params) => {
        // we add a `toString`-method, which will be used when filtering for LocalPersons
        return params.value
          ? {
              ...params.value,
              toString() {
                return makeName(this);
              },
            }
          : undefined;
      },
    };
  }
  getSearchableStrings(cell: LocalPersonViewCell): string[] {
    return cell
      ? ([
          cell.first_name,
          cell.last_name,
          cell.email,
          cell.phone,
          cell.alt_phone,
        ].filter((s) => !!s) as string[])
      : [];
  }
}

const EditCell: FC<{
  cell: LocalPersonViewCell;
  column: LocalPersonViewColumn;
  row: ZetkinViewRow;
}> = ({ cell, column, row }) => {
  const api = useGridApiContext();
  const { orgId, viewId } = useRouter().query;

  const { columnsFuture, rowsFuture, setCellValue } = useViewGrid(
    parseInt(orgId as string),
    parseInt(viewId as string)
  );
  const messages = useMessages(messageIds);

  const suggestedPeople = getPeopleInView(columnsFuture, rowsFuture);
  const [isRestrictedMode] = useAccessLevel();

  const updateCellValue = (person: ZetkinPerson | null) => {
    api.current.stopCellEditMode({
      field: 'col_' + column.id,
      id: row.id,
    });
    setCellValue(row.id, column.id, person?.id ?? null);
  };

  return (
    <ZUIPersonGridEditCell
      cell={cell}
      onUpdate={updateCellValue}
      removePersonLabel={messages.cells.localPerson.clearLabel()}
      restrictedMode={isRestrictedMode}
      suggestedPeople={suggestedPeople}
      suggestedPeopleLabel={messages.cells.localPerson.alreadyInView()}
    />
  );
};

function getPeopleInView(
  columnsFuture: IFuture<ZetkinViewColumn[]>,
  rowsFuture: IFuture<ZetkinViewRow[]>
): ZetkinPerson[] {
  const rows = rowsFuture.data;
  const cols = columnsFuture.data;

  if (!rows || !cols) {
    return [];
  }

  const personColumnIndices = cols
    .filter((col) => col.type == COLUMN_TYPE.LOCAL_PERSON)
    .map((col) => cols.indexOf(col));

  const peopleInView: ZetkinPerson[] = [];

  rows.forEach((row) => {
    row.content.forEach((cell, index) => {
      if (!cell) {
        // Skip empty cells
        return;
      }

      if (!personColumnIndices.includes(index)) {
        // Skip non-person cells
        return;
      }

      const person = cell as ZetkinPerson;
      if (peopleInView.some((existing) => existing.id == person.id)) {
        // Skip people that are already in the list
        return;
      }

      peopleInView.push(person);
    });
  });

  return peopleInView;
}
