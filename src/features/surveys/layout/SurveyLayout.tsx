import SurveyDataModel from '../models/SurveyDataModel';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';

interface SurveyLayoutProps {
  children: React.ReactNode;
  orgId: string;
  campaignId: string;
  surveyId: string;
}

const SurveyLayout: React.FC<SurveyLayoutProps> = ({
  orgId,
  children,
  campaignId,
  surveyId,
}) => {
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );

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
      title={
        <ZUIFuture future={model.getData()}>
          {(data) => {
            return (
              <ZUIEditTextinPlace
                onChange={(val) => {
                  model.setTitle(val);
                }}
                value={data.title}
              />
            );
          }}
        </ZUIFuture>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default SurveyLayout;
