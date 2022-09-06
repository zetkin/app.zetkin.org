import { isEqual } from 'lodash';
import { useIntl } from 'react-intl';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

import getColumns from './getColumns';
import { getRows } from './getRows';
import Toolbar from './Toolbar';
import { ZetkinJourneyInstance } from 'types/zetkin';
import { FunctionComponent, useState } from 'react';

import { JourneyTagColumnData } from 'utils/journeyInstanceUtils';
import useConfigurableDataGridColumns from 'components/UserConfigurableDataGrid/useConfigurableDataGridColumns';
import { useModelsFromQueryString } from 'components/UserConfigurableDataGrid/useModelsFromQueryString';

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
  const intl = useIntl();
  const { gridProps: modelGridProps } = useModelsFromQueryString();
  const [quickSearch, setQuickSearch] = useState('');
  const rows = getRows({ journeyInstances, quickSearch });

  const rawColumns = getColumns(intl, journeyInstances, tagColumnsData);
  const { columns, setColumnOrder, setColumnWidth } =
    useConfigurableDataGridColumns(storageKey, rawColumns);

  // Add localised header titles
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
      <DataGridPro
        checkboxSelection
        columns={columnsWithHeaderTitles}
        components={{ Toolbar: Toolbar }}
        componentsProps={{
          toolbar: {
            gridColumns: columnsWithHeaderTitles,
            setQuickSearch,
            setSortModel: modelGridProps.onSortModelChange,
            sortModel: modelGridProps.sortModel,
          },
        }}
        disableSelectionOnClick={true}
        filterModel={modelGridProps.filterModel}
        onColumnOrderChange={(params) => {
          setColumnOrder(params.colDef.field, params.targetIndex - 1);
        }}
        onColumnResize={(params) => {
          setColumnWidth(params.colDef.field, params.width);
        }}
        onFilterModelChange={(model) => {
          if (!isEqual(model, modelGridProps.filterModel)) {
            modelGridProps.onFilterModelChange(model);
          }
        }}
        onSortModelChange={(model) => {
          // Something strange going on here with infinite state updates, so I added the line below
          if (!isEqual(model, modelGridProps.sortModel)) {
            modelGridProps.onSortModelChange(model);
          }
        }}
        pageSize={50}
        rows={rows}
        sortModel={modelGridProps.sortModel}
        {...dataGridProps}
      />
    </>
  );
};

export default JourneyInstancesDataTable;
