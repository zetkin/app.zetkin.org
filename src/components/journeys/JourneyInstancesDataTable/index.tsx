import { isEqual } from 'lodash';
import { useIntl } from 'react-intl';
import {
  DataGridPro,
  DataGridProProps,
  GridSortModel,
} from '@mui/x-data-grid-pro';

import getColumns from './getColumns';
import { getRows } from './getRows';
import { TagMetadata } from 'utils/getTagMetadata';
import Toolbar from './Toolbar';
import { ZetkinJourneyInstance } from 'types/zetkin';
import { FunctionComponent, useState } from 'react';

interface JourneysDataTableProps {
  dataGridProps?: Partial<DataGridProProps>;
  tagMetadata: TagMetadata;
  journeyInstances: ZetkinJourneyInstance[];
}

const JourneyInstancesDataTable: FunctionComponent<JourneysDataTableProps> = ({
  dataGridProps,
  tagMetadata,
  journeyInstances,
}) => {
  const columns = getColumns(tagMetadata);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [quickSearch, setQuickSearch] = useState('');

  const rows = getRows({ journeyInstances, quickSearch });

  // Add localised header titles
  const intl = useIntl();
  const columnsWithHeaderTitles = columns.map((column) => ({
    headerName: intl.formatMessage({
      id: `pages.organizeJourneyInstances.columns.${column.field}`,
    }),
    ...column,
  }));

  return (
    <>
      <DataGridPro
        autoHeight={rows.length === 0}
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
