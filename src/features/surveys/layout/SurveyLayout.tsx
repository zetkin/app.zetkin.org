import TabbedLayout from 'utils/layout/TabbedLayout';

interface SurveyLayoutProps {
  children: React.ReactNode;
  orgId: string;
  campaignId: string;
  surveyId: string;
}

const SurveyLayout: React.FC<SurveyLayoutProps> = ({
  orgId,
  campaignId,
  surveyId,
}) => {
  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/campaigns/${campaignId}/surveys/${surveyId}`}
      defaultTab="/"
      tabs={[
        { href: '/', messageId: 'layout.organize.surveys.tabs.overview' },
        {
          href: '/questions',
          messageId: 'layout.organize.surveys.tabs.questions',
        },
        {
          href: '/submissions',
          messageId: 'layout.organize.surveys.tabs.submissions',
        },
      ]}
    />
  );
};

export default SurveyLayout;
