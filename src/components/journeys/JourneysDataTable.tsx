import { FunctionComponent } from 'react';
import { ZetkinJourneyInstance } from 'types/zetkin';

interface JourneysDataTableProps {
  journeyInstances: ZetkinJourneyInstance[];
}

const JourneysDataTable: FunctionComponent<JourneysDataTableProps> = () => (
  <p>I am a table</p>
);

export default JourneysDataTable;
