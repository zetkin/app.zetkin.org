import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import { ChatBubbleOutline, Delete, QuizOutlined } from '@mui/icons-material';
import { useContext } from 'react';

import { ELEMENT_TYPE } from 'utils/types/zetkin';
import getSurveyUrl from '../utils/getSurveyUrl';
import messageIds from '../l10n/messageIds';
import SurveyStatusChip from '../components/SurveyStatusChip';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useMemberships from 'features/organizations/hooks/useMemberships';
import useSurvey from '../hooks/useSurvey';
import useSurveyElements from '../hooks/useSurveyElements';
import useSurveyMutations from '../hooks/useSurveyMutations';
import useSurveyStats from '../hooks/useSurveyStats';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDateRangePicker from 'zui/ZUIDateRangePicker/ZUIDateRangePicker';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIFutures from 'zui/ZUIFutures';
import { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import { Msg, useMessages } from 'core/i18n';
import useSurveyState, { SurveyState } from '../hooks/useSurveyState';

interface SurveyLayoutProps {
  campId: string;
  children: React.ReactNode;
  orgId: string;
  surveyId: string;
}

const SurveyLayout: React.FC<SurveyLayoutProps> = ({
  campId,
  children,
  orgId,
  surveyId,
}) => {
  const router = useRouter();
  const parsedOrg = parseInt(orgId);
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const statsFuture = useSurveyStats(parsedOrg, parseInt(surveyId));
  const surveyFuture = useSurvey(parsedOrg, parseInt(surveyId));
  const { publish, unpublish, updateSurvey, deleteSurvey } = useSurveyMutations(
    parsedOrg,
    parseInt(surveyId)
  );
  const { surveyIsEmpty, ...elementsFuture } = useSurveyElements(
    parsedOrg,
    parseInt(surveyId)
  );
  const state = useSurveyState(parsedOrg, parseInt(surveyId));
  const originalOrgId = surveyFuture.data?.organization.id;
  const isShared = campId === 'shared';
  const orgs = useMemberships().data ?? [];

  const roleAdmin =
    orgs.find((item) => item.organization.id === originalOrgId)?.role ===
    'admin';

  const getAlertMsg = () => {
    if (!isShared || !surveyFuture.data?.organization.title) {
      return undefined;
    }
    const messageId = roleAdmin
      ? messageIds.alert.editable
      : messageIds.alert.notEditable;

    return (
      <Msg
        id={messageId}
        values={{ orgTitle: surveyFuture.data!.organization.title }}
      />
    );
  };
  const handleDelete = () => {
    deleteSurvey();
    router.push(
      `/organize/${orgId}/projects/${surveyFuture.data?.campaign?.id || ''} `
    );
  };

  return (
    <TabbedLayout
      actionButtons={
        state == SurveyState.PUBLISHED ? (
          <Button
            disabled={isShared}
            onClick={() => unpublish()}
            variant="outlined"
          >
            <Msg id={messageIds.layout.actions.unpublish} />
          </Button>
        ) : (
          <Button
            disabled={surveyIsEmpty || isShared}
            onClick={() => publish()}
            variant="contained"
          >
            <Msg id={messageIds.layout.actions.publish} />
          </Button>
        )
      }
      alertBtnMsg={
        isShared && roleAdmin ? messages.alert.goOriginal() : undefined
      }
      alertMsg={getAlertMsg()}
      baseHref={getSurveyUrl(surveyFuture.data, parsedOrg)}
      belowActionButtons={
        <ZUIDateRangePicker
          endDate={surveyFuture.data?.expires || null}
          onChange={(startDate, endDate) => {
            updateSurvey({ expires: endDate, published: startDate });
          }}
          readonly={isShared}
          startDate={surveyFuture.data?.published || null}
        />
      }
      defaultTab="/"
      ellipsisMenuItems={[
        {
          label: messages.layout.actions.delete(),
          onSelect: () => {
            showConfirmDialog({
              onSubmit: handleDelete,
              title: messages.layout.actions.delete(),
              warningText: messages.layout.actions.warning({
                surveyTitle:
                  surveyFuture.data?.title || messages.layout.unknownTitle(),
              }),
            });
          },
          startIcon: <Delete />,
        },
      ]}
      onClickAlertBtn={() => {
        router.push(
          `/organize/${originalOrgId}/projects/${surveyFuture.data?.campaign?.id}/surveys/${surveyId}`
        );
      }}
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <SurveyStatusChip state={state} />
          </Box>
          <Box display="flex" marginX={1}>
            <ZUIFutures
              futures={{
                elements: elementsFuture,
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
        <ZUIFuture future={surveyFuture}>
          {(data) => {
            return (
              <ZUIEditTextinPlace
                onChange={(val) => {
                  updateSurvey({ title: val });
                }}
                readonly={isShared}
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
