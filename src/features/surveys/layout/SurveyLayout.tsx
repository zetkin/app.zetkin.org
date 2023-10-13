import { ELEMENT_TYPE } from 'utils/types/zetkin';
import SurveyDataModel from '../models/SurveyDataModel';
import SurveyStatusChip from '../components/SurveyStatusChip';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import useSurvey from '../hooks/useSurvey';
import useSurveyMutations from '../hooks/useSurveyMutations';
import useSurveyStats from '../hooks/useSurveyStats';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import { Box, Button } from '@mui/material';
import { ChatBubbleOutline, QuizOutlined } from '@mui/icons-material';
import { Msg, useMessages } from 'core/i18n';
import useSurveyState, { SurveyState } from '../hooks/useSurveyState';

import messageIds from '../l10n/messageIds';

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
  const messages = useMessages(messageIds);
  const statsFuture = useSurveyStats(parseInt(orgId), parseInt(surveyId));
  const dataFuture = useSurvey(parseInt(orgId), parseInt(surveyId));
  const { publish, unpublish, updateSurvey } = useSurveyMutations(
    parseInt(orgId),
    parseInt(surveyId)
  );
  const state = useSurveyState(parseInt(orgId), parseInt(surveyId));
  const model = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), parseInt(surveyId))
  );

  const hasQuestions = !!model.getElements().data?.length;

  return (
    <TabbedLayout
      actionButtons={
        state == SurveyState.PUBLISHED ? (
          <Button onClick={() => unpublish()} variant="outlined">
            <Msg id={messageIds.layout.actions.unpublish} />
          </Button>
        ) : (
          <Button
            disabled={!hasQuestions}
            onClick={() => publish()}
            variant="contained"
          >
            <Msg id={messageIds.layout.actions.publish} />
          </Button>
        )
      }
      baseHref={`/organize/${orgId}/projects/${campaignId}/surveys/${surveyId}`}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={dataFuture.data?.expires || null}
          onChange={(startDate, endDate) => {
            updateSurvey({ expires: endDate, published: startDate });
          }}
          startDate={dataFuture.data?.published || null}
        />
      }
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <SurveyStatusChip state={state} />
          </Box>
          <Box display="flex" marginX={1}>
            <ZUIFutures
              futures={{
                elements: model.getElements(),
                stats: statsFuture,
              }}
            >
              {({ data: { elements, stats } }) => {
                const questionLength = elements.filter(
                  (elem) => elem.type == ELEMENT_TYPE.QUESTION
                ).length;

                const labels: ZUIIconLabelProps[] = [];

                if (questionLength > 0) {
                  labels.push({
                    icon: <QuizOutlined />,
                    label: (
                      <Msg
                        id={messageIds.layout.stats.questions}
                        values={{
                          numQuestions: questionLength,
                        }}
                      />
                    ),
                  });
                }

                if (stats.submissionCount > 0) {
                  labels.push({
                    icon: <ChatBubbleOutline />,
                    label: (
                      <Msg
                        id={messageIds.layout.stats.submissions}
                        values={{
                          numSubmissions: stats.submissionCount,
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
        { href: '/', label: messages.tabs.overview() },
        {
          href: '/questions',
          label: messages.tabs.questions(),
        },
        {
          href: '/submissions',
          label: messages.tabs.submissions(),
        },
      ]}
      title={
        <ZUIFuture future={dataFuture}>
          {(data) => {
            return (
              <ZUIEditTextinPlace
                onChange={(val) => {
                  updateSurvey({ title: val });
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
