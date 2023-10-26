import { useQuery } from 'react-query';

import DisplayTimeFrame from '../DisplayTimeFrame';
import getActivity from 'features/smartSearch/fetching/getActivity';
import getLocation from 'features/smartSearch/fetching/getLocation';
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

  const activityQuery = useQuery(
    ['activity', orgId, activityId],
    getActivity(orgId.toString(), activityId?.toString() as string),
    { enabled: !!activityId }
  );
  const locationQuery = useQuery(
    ['location', orgId, locationId],
    getLocation(orgId.toString(), locationId?.toString() as string),
    { enabled: !!locationId }
  );

  const activityTitle = activityQuery?.data?.title || null;
  const locationTitle = locationQuery?.data?.title || null;

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
