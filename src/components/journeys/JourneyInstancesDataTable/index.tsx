import { DataGridPro } from '@mui/x-data-grid-pro';
import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import getColumns from './getColumns';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

interface JourneysDataTableProps {
  journey: ZetkinJourney;
  journeyInstances: ZetkinJourneyInstance[];
}

const JourneyInstancesDataTable: FunctionComponent<JourneysDataTableProps> = ({
  journey,
  journeyInstances,
}) => {
  const intl = useIntl();
  const columns = getColumns(intl, journeyInstances, journey);

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
