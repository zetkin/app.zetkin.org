import { Button } from '@mui/material';
import { FormattedMessage as Msg } from 'react-intl';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import SurveyDataModel, { SurveyState } from '../models/SurveyDataModel';

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
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );

  const hasQuestions = !!model.getData().data?.elements.length;

  return (
    <TabbedLayout
      actionButtons={
        model.state == SurveyState.PUBLISHED ? (
          <Button variant="outlined">
            <Msg id="layout.organize.surveys.actions.unpublish" />
          </Button>
        ) : (
          <Button
            disabled={!hasQuestions}
            onClick={() => model.publish()}
            variant="contained"
          >
            <Msg id="layout.organize.surveys.actions.publish" />
          </Button>
        )
      }
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
    />
  );
};

export default SurveyLayout;
