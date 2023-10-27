import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  CampaignParticipationConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedCampaignTitle from './UnderlinedCampaignTitle';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import { useNumericRouteParams } from 'core/hooks';
import useTitlesForCampaignParticipation from 'features/smartSearch/hooks/useTitlesForCampaignParticipation';
const localMessageIds = messageIds.filters.campaignParticipation;

interface DisplayCampaignParticipationProps {
  filter: SmartSearchFilterWithId<CampaignParticipationConfig>;
}

const DisplayCampaignParticipation = ({
  filter,
}: DisplayCampaignParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const {
    operator,
    state,
    campaign: campId,
    activity: activityId,
    location: locationId,
  } = config;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const { activityTitle, locationTitle } = useTitlesForCampaignParticipation(
    orgId,
    activityId,
    campId,
    locationId
  );

  return (
    <Msg
      id={messageIds.filters.campaignParticipation.inputString}
      values={{
        activitySelect: activityTitle ? (
          <UnderlinedMsg
            id={localMessageIds.activitySelect.activity}
            values={{
              activity: <UnderlinedText text={activityTitle} />,
            }}
          />
        ) : (
          <UnderlinedMsg id={localMessageIds.activitySelect.any} />
        ),
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        bookedSelect: (
          <UnderlinedMsg id={localMessageIds.bookedSelect[state]} />
        ),
        campaignSelect: campId ? (
          <UnderlinedCampaignTitle campId={campId} orgId={orgId} />
        ) : (
          <UnderlinedMsg id={localMessageIds.campaignSelect.any} />
        ),
        haveSelect: <Msg id={localMessageIds.haveSelect[operator]} />,
        locationSelect: locationTitle ? (
          <UnderlinedMsg
            id={localMessageIds.locationSelect.location}
            values={{
              location: <UnderlinedText text={locationTitle} />,
            }}
          />
        ) : (
          <UnderlinedMsg id={localMessageIds.locationSelect.any} />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayCampaignParticipation;
