import { FunctionComponent } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import getColumns, { ColumnNames } from './getColumns';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

interface JourneysDataTableProps {
  columnNames: ColumnNames;
  dynamicColumns: GridColDef[];
  journey: ZetkinJourney;
  journeyInstances: ZetkinJourneyInstance[];
}

const JourneyInstancesDataTable: FunctionComponent<JourneysDataTableProps> = ({
  columnNames,
  dynamicColumns,
  journey,
  journeyInstances,
}) => {
  const columns = getColumns(columnNames, dynamicColumns, journey);

  return (
    <>
      <DataGridPro
        autoHeight
        checkboxSelection
        columns={columns}
        pageSize={10}
        pagination
        rows={journeyInstances}
      />
    </>
  );
};

export default JourneyInstancesDataTable;
