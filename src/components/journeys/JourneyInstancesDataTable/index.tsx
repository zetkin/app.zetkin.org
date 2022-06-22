import { isEqual } from 'lodash';
import { useIntl } from 'react-intl';
import { DataGridProProps, GridSortModel } from '@mui/x-data-grid-pro';

import getColumns from './getColumns';
import { getRows } from './getRows';
import Toolbar from './Toolbar';
import { ZetkinJourneyInstance } from 'types/zetkin';
import { FunctionComponent, useState } from 'react';

import { JourneyTagColumnData } from 'utils/journeyInstanceUtils';
import UserConfigurableDataGrid from 'components/UserConfigurableDataGrid';

interface JourneysDataTableProps {
  dataGridProps?: Partial<DataGridProProps>;
  tagColumnsData: JourneyTagColumnData[];
  journeyInstances: ZetkinJourneyInstance[];
  storageKey?: string;
}

const JourneyInstancesDataTable: FunctionComponent<JourneysDataTableProps> = ({
  dataGridProps,
  tagColumnsData,
  journeyInstances,
  storageKey = 'journeyInstances',
}) => {
  const columns = getColumns(tagColumnsData);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [quickSearch, setQuickSearch] = useState('');

  const rows = getRows({ journeyInstances, quickSearch });

  // Add localised header titles
  const intl = useIntl();
  const columnsWithHeaderTitles = columns.map((column) => ({
    headerName:
      column.headerName ||
      intl.formatMessage({
        id: `pages.organizeJourneyInstances.columns.${column.field}`,
      }),
    ...column,
  }));

  return (
    <>
      <UserConfigurableDataGrid
        checkboxSelection
        columns={columnsWithHeaderTitles}
        components={{ Toolbar: Toolbar }}
        componentsProps={{
          toolbar: {
            gridColumns: columnsWithHeaderTitles,
            setQuickSearch,
            setSortModel,
            sortModel,
          },
        }}
        disableSelectionOnClick={true}
        onSortModelChange={(model) => {
          // Something strange going on here with infinite state updates, so I added the line below
          if (!isEqual(model, sortModel)) {
            setSortModel(model);
          }
        }}
        pageSize={50}
        rows={rows}
        sortModel={sortModel}
        storageKey={storageKey}
        {...dataGridProps}
      />
    </>
  );
};

export default JourneyInstancesDataTable;
