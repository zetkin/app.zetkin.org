import { FunctionComponent } from 'react';

type ZetkinJourney = {
  id: number;
};

interface JourneysDataTableProps {
  journeys: ZetkinJourney[];
}

const JourneysDataTable: FunctionComponent<JourneysDataTableProps> = () => (
  <p>I am a table</p>
);

export default JourneysDataTable;
