import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getActivity from 'features/smartSearch/fetching/getActivity';
import getCampaign from 'features/campaigns/fetching/getCampaign';
import getLocation from 'features/smartSearch/fetching/getLocation';
import { getTimeFrameWithConfig } from '../../utils';
import {
  CampaignParticipationConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

interface DisplayCampaignParticipationProps {
  filter: SmartSearchFilterWithId<CampaignParticipationConfig>;
}

const DisplayCampaignParticipation = ({
  filter,
}: DisplayCampaignParticipationProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const {
    operator,
    state,
    campaign: campId,
    activity: activityId,
    location: locationId,
  } = config;
  const op = filter.op || OPERATION.ADD;
  const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const campaignQuery = useQuery(
    ['campaign', orgId, campId],
    getCampaign(orgId as string, campId?.toString() as string),
    { enabled: !!campId }
  );
  const activityQuery = useQuery(
    ['activity', orgId, activityId],
    getActivity(orgId as string, activityId?.toString() as string),
    { enabled: !!activityId }
  );
  const locationQuery = useQuery(
    ['location', orgId, locationId],
    getLocation(orgId as string, locationId?.toString() as string),
    { enabled: !!locationId }
  );

  const campaignTitle = campaignQuery?.data?.title || null;
  const activityTitle = activityQuery?.data?.title || null;
  const locationTitle = locationQuery?.data?.title || null;

  return (
    <Msg
      id="misc.smartSearch.campaign_participation.inputString"
      values={{
        activitySelect: activityTitle ? (
          <Msg
            id="misc.smartSearch.campaign_participation.activitySelect.activity"
            values={{
              activity: activityTitle,
            }}
          />
        ) : (
          <Msg id="misc.smartSearch.campaign_participation.activitySelect.any" />
        ),
        addRemoveSelect: (
          <Msg
            id={`misc.smartSearch.campaign_participation.addRemoveSelect.${op}`}
          />
        ),
        bookedSelect: (
          <Msg
            id={`misc.smartSearch.campaign_participation.bookedSelect.${state}`}
          />
        ),
        campaignSelect: campaignTitle ? (
          <Msg
            id="misc.smartSearch.campaign_participation.campaignSelect.campaign"
            values={{
              campaign: campaignTitle,
            }}
          />
        ) : (
          <Msg id="misc.smartSearch.campaign_participation.campaignSelect.any" />
        ),
        haveSelect: (
          <Msg
            id={`misc.smartSearch.campaign_participation.haveSelect.${operator}`}
          />
        ),
        locationSelect: locationTitle ? (
          <Msg
            id="misc.smartSearch.campaign_participation.locationSelect.location"
            values={{
              location: locationTitle,
            }}
          />
        ) : (
          <Msg id="misc.smartSearch.campaign_participation.locationSelect.any" />
        ),
        timeFrame: (
          <Msg
            id={`misc.smartSearch.timeFrame.preview.${timeFrame}`}
            values={{
              afterDate: after?.toISOString().slice(0, 10),
              beforeDate: before?.toISOString().slice(0, 10),
              days: numDays,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplayCampaignParticipation;
