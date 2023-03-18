import { FC } from 'react';
import { AssignmentOutlined, ChatBubbleOutline } from '@mui/icons-material';

import { dateOrNull } from 'utils/dateUtils';
import useModel from 'core/useModel';
import { ZetkinSurvey } from 'utils/types/zetkin';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';
import SurveyDataModel, {
  SurveyState,
} from 'features/surveys/models/SurveyDataModel';

interface SurveyOverviewListItemProps {
  survey: ZetkinSurvey;
}

const SurveyOverviewListItem: FC<SurveyOverviewListItemProps> = ({
  survey,
}) => {
  const dataModel = useModel(
    (env) => new SurveyDataModel(env, survey.organization.id, survey.id)
  );
  const data = dataModel.getData().data;
  const stats = dataModel.getStats().data;

  if (!data) {
    return null;
  }

  let hasExpired = false;
  if (data.expires) {
    const expires = new Date(data.expires);
    const now = new Date();

    if (expires < now) {
      hasExpired = true;
    }
  }

  const state = dataModel.state;
  let color = STATUS_COLORS.GRAY;
  if (state === SurveyState.PUBLISHED) {
    color = STATUS_COLORS.GREEN;
  } else if (state === SurveyState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (hasExpired) {
    color = STATUS_COLORS.RED;
  }

  const submissionCount = stats?.submissionCount || 0;

  return (
    <OverviewListItem
      color={color}
      endDate={dateOrNull(survey.expires)}
      endNumber={submissionCount.toString()}
      href={`/organize/${survey.organization.id}/projects/${
        data.campaign?.id ?? 'standalone'
      }/surveys/${survey.id}`}
      PrimaryIcon={AssignmentOutlined}
      SecondaryIcon={ChatBubbleOutline}
      startDate={dateOrNull(survey.published)}
      title={data.title}
    />
  );
};

export default SurveyOverviewListItem;
