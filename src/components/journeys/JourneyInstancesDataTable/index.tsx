import { DataGridPro } from '@mui/x-data-grid-pro';
import { FunctionComponent } from 'react';

import { TagMetadata } from 'pages/api/organize/[orgId]/journeys/[journeyId]/getTagMetadata';
import getColumns, { ColumnNames } from './getColumns';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

interface JourneysDataTableProps {
  columnNames: ColumnNames;
  tagMetadata: TagMetadata;
  journey: ZetkinJourney;
  journeyInstances: ZetkinJourneyInstance[];
}

const JourneyInstancesDataTable: FunctionComponent<JourneysDataTableProps> = ({
  columnNames,
  tagMetadata,
  journey,
  journeyInstances,
}) => {
  const columns = getColumns(columnNames, tagMetadata, journey);

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
