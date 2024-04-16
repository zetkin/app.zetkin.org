import DisplayTimeFrame from '../DisplayTimeFrame';
import { FC } from 'react';
import { getTimeFrameWithConfig } from '../../utils';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useNumericRouteParams } from 'core/hooks';
import {
  JourneyFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from '../../types';

interface DisplayJourneyProps {
  filter: SmartSearchFilterWithId<JourneyFilterConfig>;
}
const localMessageIds = messageIds.filters.journey;

const DisplayJourney: FC<DisplayJourneyProps> = ({ filter }): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const op = filter.op || OPERATION.ADD;
  const { operator, journey: journeyId, after, before } = filter.config;
  const journeys = useJourneys(orgId).data || [];
  const journeyTitle = journeys?.find((item) => item.id === journeyId)?.title;
  const timeFrame = getTimeFrameWithConfig({
    after: after,
    before: before,
  });
  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        journeySelect: <UnderlinedText text={`"${journeyTitle}"`} />,
        operator: (
          <UnderlinedMsg
            id={localMessageIds[operator === 'opened' ? 'opened' : 'closed']}
          />
        ),
        statusText: (
          <Msg
            id={
              operator === 'opened'
                ? localMessageIds.thatOpened
                : localMessageIds.thatFinished
            }
          />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};
export default DisplayJourney;
