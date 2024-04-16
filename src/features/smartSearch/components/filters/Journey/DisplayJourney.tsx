import { FC } from 'react';
import { JourneyFilterConfig, SmartSearchFilterWithId } from '../../types';

interface DisplayJourneyProps {
  filter: SmartSearchFilterWithId<JourneyFilterConfig>;
}
const DisplayJourney: FC<DisplayJourneyProps> = () => {
  return <div>DisplayJourney</div>;
};

export default DisplayJourney;
