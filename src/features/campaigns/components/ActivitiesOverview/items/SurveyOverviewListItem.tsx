import { FC } from 'react';
import { AssignmentOutlined, ChatBubbleOutline } from '@mui/icons-material';

import getSurveyUrl from 'features/surveys/utils/getSurveyUrl';
import OverviewListItem from './OverviewListItem';
import { SurveyActivity } from 'features/campaigns/types';
import { useNumericRouteParams } from 'core/hooks';
import useSurveyStats from 'features/surveys/hooks/useSurveyStats';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

interface SurveyOverviewListItemProps {
  activity: SurveyActivity;
  focusDate: Date | null;
}

const SurveyOverviewListItem: FC<SurveyOverviewListItemProps> = ({
  activity,
  focusDate,
}) => {
  const survey = activity.data;
  const stats = useSurveyStats(survey.organization.id, survey.id).data;
  const submissionCount = stats?.submissionCount || 0;
  const { orgId } = useNumericRouteParams();
  return (
    <OverviewListItem
      endDate={activity.visibleUntil}
      endNumber={submissionCount}
      focusDate={focusDate}
      href={getSurveyUrl(survey, orgId)}
      PrimaryIcon={AssignmentOutlined}
      SecondaryIcon={ChatBubbleOutline}
      startDate={activity.visibleFrom}
      statusBar={
        stats?.submissionCount ? (
          <ZUIStackedStatusBar
            height={4}
            values={[
              {
                color: 'statusColors.orange',
                value: stats.unlinkedSubmissionCount,
              },
              {
                color: 'statusColors.green',
                value: stats.submissionCount - stats.unlinkedSubmissionCount,
              },
            ]}
          />
        ) : null
      }
      title={survey.title}
    />
  );
};

export default SurveyOverviewListItem;
