import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

import getColumns from './getColumns';
import { getRows } from './getRows';
import Toolbar from './Toolbar';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import { FunctionComponent, useState } from 'react';

import { JourneyTagColumnData } from 'features/journeys/utils/journeyInstanceUtils';
import useConfigurableDataGridColumns from 'zui/ZUIUserConfigurableDataGrid/useConfigurableDataGridColumns';
import { useMessages } from 'core/i18n';
import useModelsFromQueryString from 'zui/ZUIUserConfigurableDataGrid/useModelsFromQueryString';

import messageIds from 'features/journeys/l10n/messageIds';

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
  const messages = useMessages(messageIds);
  const { gridProps: modelGridProps } = useModelsFromQueryString();
  const [quickSearch, setQuickSearch] = useState('');
  const rows = getRows({ journeyInstances, quickSearch });

  const rawColumns = getColumns(messages, journeyInstances, tagColumnsData);
  const { columns, setColumnOrder, setColumnWidth } =
    useConfigurableDataGridColumns(storageKey, rawColumns);

  // Add localised header titles
  const columnsWithHeaderTitles = columns.map((column) => {
    const fieldName =
      column.field in messages.instances.columns
        ? (column.field as keyof typeof messages.instances.columns)
        : null;
    return {
      headerName:
        column.headerName ||
        (fieldName ? messages.instances.columns[fieldName]() : ''),
      ...column,
    };
  });

  return (
    <>
      <DataGridPro
        checkboxSelection
        columns={columnsWithHeaderTitles}
        components={{ Toolbar: Toolbar }}
        componentsProps={{
          toolbar: {
            gridColumns: columnsWithHeaderTitles,
            onQuickSearchChange: setQuickSearch,
            onSortModelChange: modelGridProps.onSortModelChange,
            sortModel: modelGridProps.sortModel,
          },
        }}
        disableSelectionOnClick={true}
        onColumnOrderChange={(params) => {
          setColumnOrder(params.colDef.field, params.targetIndex - 1);
        }}
        onColumnResize={(params) => {
          setColumnWidth(params.colDef.field, params.width);
        }}
        pageSize={50}
        rows={rows}
        {...modelGridProps}
        {...dataGridProps}
      />
    </>
  );
};

export default JourneyInstancesDataTable;
