import { IColumnType } from '.';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import ZUIPersonGridCell from 'zui/ZUIPersonGridCell';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';

import { COLUMN_TYPE, LocalPersonViewColumn } from '../../types';
import { GridColDef, useGridApiContext } from '@mui/x-data-grid-pro';
import { ZetkinPerson, ZetkinViewRow } from 'utils/types/zetkin';
import { FC } from 'react';

type LocalPersonViewCell = null | ZetkinPerson;

export default class LocalPersonColumnType
  implements IColumnType<LocalPersonViewColumn, LocalPersonViewCell>
{
  cellToString(cell: ZetkinPerson | null): string {
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
        return <ZUIPersonGridCell cell={params.value} />;
      },
      renderEditCell: (params) => {
        <EditCell cell={params.value} col={col} row={params.row} />;
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
  cell: ZetkinPerson | null;
  col: LocalPersonViewColumn;
  row: ZetkinViewRow;
}> = (cell, col, row) => {
  const api = useGridApiContext();
  const model = useViewDataModel();

  const getPeopleInView = (people: ZetkinPerson[]) => {
    return usePeopleInView(model, people);
  };

  const updateCellValue = (person: ZetkinPerson | null) => {
    api.current.stopCellEditMode({
      field: 'col_' + col.id,
      id: row.id,
    });
    model.setCellValue(row.id, col.id, person?.id ?? null);
  };

  return (
    <ZUIPersonGridEditCell
      cell={cell}
      onGetSuggestedPeople={getPeopleInView}
      onUpdate={updateCellValue}
      removePersonLabel="misc.views.cells.localPerson.clearLabel"
    />
  );
};

function usePeopleInView(
  model: ViewDataModel,
  searchResults: ZetkinPerson[] = []
): ZetkinPerson[] {
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

  if (searchResults.length) {
    // Filter down people in view to only include search matches
    const matchingIds = searchResults.map((person) => person.id);
    return peopleInView.filter((person) => matchingIds.includes(person.id));
  } else {
    return peopleInView;
  }
}
