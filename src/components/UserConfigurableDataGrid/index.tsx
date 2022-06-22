import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

import useConfigurableDataGridColumns from './useConfigurableDataGridColumns';
import { useModelsFromQueryString } from './useModelsFromQueryString';

type UserConfigurableDataGridProps = DataGridProProps & {
  storageKey: string;
};

const UserConfigurableDataGrid: React.FC<UserConfigurableDataGridProps> = ({
  storageKey,
  ...gridProps
}) => {
  const { columns, setColumnOrder, setColumnWidth } =
    useConfigurableDataGridColumns(storageKey, gridProps.columns);

  const { gridProps: modelGridProps } = useModelsFromQueryString();

  return (
    <DataGridPro
      {...gridProps}
      {...modelGridProps}
      columns={columns}
      onColumnOrderChange={(params, event, details) => {
        // Subtract one for selection column, if it's visible
        const targetIndex = gridProps.checkboxSelection
          ? params.targetIndex - 1
          : params.targetIndex;

        setColumnOrder(params.colDef.field, targetIndex);

        if (gridProps.onColumnOrderChange) {
          gridProps.onColumnOrderChange(params, event, details);
        }
      }}
      onColumnResize={(params, event, details) => {
        setColumnWidth(params.colDef.field, params.width);

        if (gridProps.onColumnResize) {
          gridProps.onColumnResize(params, event, details);
        }
      }}
    />
  );
};

export default UserConfigurableDataGrid;
