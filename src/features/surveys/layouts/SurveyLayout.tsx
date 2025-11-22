import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import {
  ArrowForward,
  ChatBubbleOutline,
  ContentCopy,
  Delete,
  Groups,
  QuizOutlined,
} from '@mui/icons-material';
import React, { useCallback, useContext, useState } from 'react';

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
import ChangeCampaignDialog from '../../campaigns/components/ChangeCampaignDialog';
import ZUISnackbarContext from '../../../zui/ZUISnackbarContext';
import { useApiClient } from 'core/hooks';
import surveyToList from 'features/surveys/rpc/surveyToList';
import duplicateSurvey from '../rpc/duplicateSurvey';

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
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { surveyIsEmpty, ...elementsFuture } = useSurveyElements(
    parsedOrg,
    parseInt(surveyId)
  );
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const state = useSurveyState(parsedOrg, parseInt(surveyId));
  const originalOrgId = surveyFuture.data?.organization.id;
  const isShared = campId === 'shared';
  const orgs = useMemberships().data ?? [];
  const apiClient = useApiClient();

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
  const handleDelete = async () => {
    await deleteSurvey();
    await router.push(
      `/organize/${orgId}/projects/${surveyFuture.data?.campaign?.id || ''} `
    );
  };

  const handleDuplicate = async () => {
    const res = await apiClient.rpc(duplicateSurvey, {
      campId: parseInt(campId),
      orgId: parsedOrg,
      surveyId: parseInt(surveyId),
    });

    if (res) {
      await router.push(
        `/organize/${res.organization.id}/projects/${campId}/surveys/${res.id}`
      );
      showSnackbar('success', messages.surveyDuplicated.success());
    } else {
      showSnackbar('error', messages.surveyDuplicated.error());
    }
  };

  const handleOnCampaignSelected = async (campaignId: number) => {
    const updatedSurvey = await updateSurvey({ campaign_id: campaignId });
    await router.push(
      `/organize/${orgId}/projects/${campaignId}/surveys/${surveyId}`
    );
    showSnackbar(
      'success',
      messages.surveyChangeCampaignDialog.success({
        campaignTitle: updatedSurvey.campaign!.title,
        surveyTitle: surveyFuture.data!.title,
      })
    );
  };

  const handleCreateList = useCallback(
    async (folderId?: number) => {
      try {
        if (!surveyFuture.data) {
          showSnackbar('error', messages.surveyToList.error());
          return;
        }

        const view = await apiClient.rpc(surveyToList, {
          firstNameColumnName: messages.submissions.firstNameColumn(),
          folderId,
          lastNameColumName: messages.submissions.lastNameColumn(),
          orgId: parseInt(orgId),
          surveyId: parseInt(surveyId),
          title: messages.surveyToList.title({
            surveyTitle: surveyFuture.data.title,
          }),
        });
        await router.push(
          `/organize/${view.organization.id}/people/lists/${view.id}`
        );
      } catch (e) {
        showSnackbar('error', messages.surveyToList.error());
      }
    },
    [apiClient, orgId, surveyId, router.push, surveyFuture.data]
  );

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
          label: messages.layout.actions.duplicate(),
          onSelect: () => handleDuplicate(),
          startIcon: <ContentCopy />,
        },
        {
          label: messages.layout.actions.move(),
          onSelect: () => setIsMoveDialogOpen(true),
          startIcon: <ArrowForward />,
        },
        {
          label: messages.layout.actions.createList(),
          onSelect: () => handleCreateList(),
          startIcon: <Groups />,
        },
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
          <ChangeCampaignDialog
            errorMessage={messages.surveyChangeCampaignDialog.error()}
            onCampaignSelected={handleOnCampaignSelected}
            onClose={() => setIsMoveDialogOpen(false)}
            open={isMoveDialogOpen}
            title={messages.surveyChangeCampaignDialog.title()}
          />
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
        {
          href: '/insights',
          label: 'Insights',
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
