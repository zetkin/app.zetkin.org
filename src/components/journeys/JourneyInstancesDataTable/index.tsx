import { isEqual } from 'lodash';
import {
  DataGridPro,
  DataGridProProps,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import { FunctionComponent, useState } from 'react';

import { getRows } from './getRows';
import { TagMetadata } from 'utils/getTagMetadata';
import Toolbar from './Toolbar';
import getColumns, { ColumnNames } from './getColumns';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

interface JourneysDataTableProps {
  columnNames: ColumnNames;
  dataGridProps?: Partial<DataGridProProps>;
  tagMetadata: TagMetadata;
  journey: ZetkinJourney;
  journeyInstances: ZetkinJourneyInstance[];
}

const JourneyInstancesDataTable: FunctionComponent<JourneysDataTableProps> = ({
  columnNames,
  dataGridProps,
  tagMetadata,
  journey,
  journeyInstances,
}) => {
  const columns = getColumns(columnNames, tagMetadata, journey);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [quickSearch, setQuickSearch] = useState('');

  const rows = getRows({ journeyInstances, quickSearch });

  return (
    <>
      <DataGridPro
        autoHeight={rows.length === 0}
        checkboxSelection
        columns={columns}
        components={{ Toolbar: Toolbar }}
        componentsProps={{
          toolbar: {
            gridColumns: columns,
            setQuickSearch,
            setSortModel,
            sortModel,
          },
        }}
        onSortModelChange={(model) => {
          // Something strange going on here with infinite state updates, so I added the line below
          if (!isEqual(model, sortModel)) {
            setSortModel(model);
          }
        }}
        pageSize={50}
        pagination
        rows={rows}
        sortModel={sortModel}
        {...dataGridProps}
      />
    </>
  );
};

export default JourneyInstancesDataTable;
