import { FC } from 'react';
import { GridColDef, useGridApiContext } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import ZUIPersonGridCell from 'zui/ZUIPersonGridCell';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';
import { COLUMN_TYPE, LocalPersonViewColumn } from '../../types';
import { ZetkinPerson, ZetkinViewRow } from 'utils/types/zetkin';

import messageIds from 'features/views/l10n/messageIds';
import { useMessages } from 'core/i18n';

type LocalPersonViewCell = null | ZetkinPerson;

export default class LocalPersonColumnType
  implements IColumnType<LocalPersonViewColumn, LocalPersonViewCell>
{
  cellToString(cell: LocalPersonViewCell): string {
    return cell ? `${cell.first_name} ${cell.last_name}` : '';
  }
  getColDef(
    col: LocalPersonViewColumn
  ): Omit<GridColDef<ZetkinViewRow>, 'field'> {
    return {
      align: 'center',
      editable: true,
      filterable: false,
      headerAlign: 'center',

      renderCell: (params) => {
        return <ZUIPersonGridCell person={params.value} />;
      },
      renderEditCell: (params) => {
        return <EditCell cell={params.value} column={col} row={params.row} />;
      },
      sortComparator: (
        val0: LocalPersonViewCell,
        val1: LocalPersonViewCell
      ) => {
        if (!val0 && !val1) {
          return 0;
        }
        if (!val0) {
          return 1;
        }
        if (!val1) {
          return -1;
        }

        const name0 = val0.first_name + val1.last_name;
        const name1 = val1.first_name + val1.last_name;
        return name0.localeCompare(name1);
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
  const model = useViewDataModel();
  const messages = useMessages(messageIds);

  const suggestedPeople = getPeopleInView(model);
  const [isRestrictedMode] = useAccessLevel();

  const updateCellValue = (person: ZetkinPerson | null) => {
    api.current.stopCellEditMode({
      field: 'col_' + column.id,
      id: row.id,
    });
    model.setCellValue(row.id, column.id, person?.id ?? null);
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

function getPeopleInView(model: ViewDataModel): ZetkinPerson[] {
  const rows = model.getRows().data;
  const cols = model.getColumns().data;

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
