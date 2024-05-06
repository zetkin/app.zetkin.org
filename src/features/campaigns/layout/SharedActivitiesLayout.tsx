import { AutoAwesomeMotionOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

import messageIds from '../l10n/messageIds';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useSurveys from 'features/surveys/hooks/useSurveys';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import { Msg, useMessages } from 'core/i18n';

interface SharedActivitiesLayout {
  children: React.ReactNode;
  orgId: string;
}

const SharedActivitiesLayout: React.FC<SharedActivitiesLayout> = ({
  children,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const parsedOrgId = parseInt(orgId);
  const surveys = useSurveys(parsedOrgId).data ?? [];

  const sharedSurveys = surveys.filter(
    (survey) =>
      survey.org_access === 'suborgs' &&
      survey.organization.id === parsedOrgId &&
      !dayjs(survey.expires).isBefore(dayjs(), 'day')
  );

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/shared`}
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box display="flex" marginX={1}>
            <ZUIIconLabelRow
              iconLabels={[
                {
                  icon: <AutoAwesomeMotionOutlined />,
                  label: (
                    <Msg
                      id={messageIds.sharedLayout.subtitle}
                      values={{ numOfActivities: sharedSurveys.length }}
                    />
                  ),
                },
              ]}
            />
          </Box>
        </Box>
      }
      tabs={[
        { href: '/', label: messages.sharedLayout.tabs.overview() },
        {
          href: '/activities',
          label: messages.sharedLayout.tabs.activities(),
        },
        {
          href: '/archive',
          label: messages.sharedLayout.tabs.archive(),
        },
      ]}
      title={messages.sharedLayout.title()}
    >
      {children}
    </TabbedLayout>
  );
};
export default SharedActivitiesLayout;
