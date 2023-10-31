import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  CampaignParticipationConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedActivityTitle from './UnderlinedActivityTitle';
import UnderlinedCampaignTitle from './UnderlinedCampaignTitle';
import UnderlinedLocationTitle from './UnderlinedLocationTitle';
import UnderlinedMsg from '../../UnderlinedMsg';
import { useNumericRouteParams } from 'core/hooks';

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

  return (
    <Msg
      id={messageIds.filters.campaignParticipation.inputString}
      values={{
        activitySelect: activityId ? (
          <UnderlinedActivityTitle activityId={activityId} orgId={orgId} />
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
        locationSelect: locationId ? (
          <UnderlinedLocationTitle locationId={locationId} orgId={orgId} />
        ) : (
          <UnderlinedMsg id={localMessageIds.locationSelect.any} />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayCampaignParticipation;
