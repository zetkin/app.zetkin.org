import { FormattedMessage as Msg } from 'react-intl';
import SurveyStatusChip from '../components/SurveyStatusChip';
import SurveySubmissionsModel from '../models/SurveySubmissionsModel';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import { Box, Button } from '@mui/material';
import { ChatBubbleOutline, QuizOutlined } from '@mui/icons-material';
import SurveyDataModel, { SurveyState } from '../models/SurveyDataModel';

interface SurveyLayoutProps {
  children: React.ReactNode;
  orgId: string;
  campaignId: string;
  surveyId: string;
}

const SurveyLayout: React.FC<SurveyLayoutProps> = ({
  children,
  orgId,
  campaignId,
  surveyId,
}) => {
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );

  const subsModel = useModel(
    (env) =>
      new SurveySubmissionsModel(env, parseInt(orgId), parseInt(surveyId))
  );

  const hasQuestions = !!model.getData().data?.elements.length;

  return (
    <TabbedLayout
      actionButtons={
        model.state == SurveyState.PUBLISHED ? (
          <Button onClick={() => model.unpublish()} variant="outlined">
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
      subtitle={
        <Box alignItems="center" display="flex">
          <SurveyStatusChip state={model.state} />
          <Box display="flex" marginX={1}>
            <ZUIFutures
              futures={{
                submissions: subsModel.getSubmissions(),
                survey: model.getData(),
              }}
            >
              {({ data: { submissions, survey } }) => {
                const questionLength = survey?.elements.filter(
                  (question) => question.type === 'question'
                ).length;

                // TODO: Replace this with custom RPC for survey stats
                const submissionsLength = submissions.length;
                const labels: ZUIIconLabelProps[] = [];

                if (questionLength > 0) {
                  labels.push({
                    icon: <QuizOutlined />,
                    label: (
                      <Msg
                        id="layout.organize.surveys.stats.questions"
                        values={{
                          numQuestions: questionLength,
                        }}
                      />
                    ),
                  });
                }

                if (submissionsLength > 0) {
                  labels.push({
                    icon: <ChatBubbleOutline />,
                    label: (
                      <Msg
                        id="layout.organize.surveys.stats.submissions"
                        values={{
                          numSubmissions: submissionsLength,
                        }}
                      />
                    ),
                  });
                }

                return <ZUIIconLabelRow iconLabels={labels} />;
              }}
            </ZUIFutures>
          </Box>
        </Box>
      }
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
