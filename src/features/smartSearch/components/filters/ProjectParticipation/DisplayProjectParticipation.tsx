import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  ProjectParticipationConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedActivityTitle from './UnderlinedActivityTitle';
import UnderlinedProjectTitle from './UnderlinedProjectTitle';
import UnderlinedLocationTitle from './UnderlinedLocationTitle';
import UnderlinedMsg from '../../UnderlinedMsg';
import { useNumericRouteParams } from 'core/hooks';

const localMessageIds = messageIds.filters.campaignParticipation;

interface DisplayProjectParticipationProps {
  filter: SmartSearchFilterWithId<ProjectParticipationConfig>;
}

const DisplayProjectParticipation = ({
  filter,
}: DisplayProjectParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const {
    operator,
    state,
    status,
    project: projectId,
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
        haveSelect: <Msg id={localMessageIds.haveSelect[operator]} />,
        locationSelect: locationId ? (
          <UnderlinedLocationTitle locationId={locationId} orgId={orgId} />
        ) : (
          <UnderlinedMsg id={localMessageIds.locationSelect.any} />
        ),
        projectSelect: projectId ? (
          <UnderlinedProjectTitle orgId={orgId} projectId={projectId} />
        ) : (
          <UnderlinedMsg id={localMessageIds.projectSelect.any} />
        ),
        statusSelect: status ? (
          <UnderlinedMsg id={localMessageIds.statusSelect[status]} />
        ) : (
          <UnderlinedMsg id={localMessageIds.statusSelect.any} />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayProjectParticipation;
