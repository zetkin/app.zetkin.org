import { FC, Fragment, useState } from 'react';
import { Assignment, GroupWorkOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';

import MyActivityListItem from 'features/my/components/MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinSurvey } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import ZUIModal from 'zui/components/ZUIModal';
import { surveySubmissionDeleted } from '../store';
import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

type SurveyCardProps = {
  onSelectSurvey: (surveyId: number) => void;
  survey: ZetkinSurvey;
};

const SurveyCard: FC<SurveyCardProps> = ({ survey, onSelectSurvey }) => {
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const responseBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );

  const response = responseBySurveyId[survey.id];

  const hasMeaningfulContent =
    !!response &&
    Object.entries(response).some(([, value]) => {
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return true;
    });

  return (
    <>
      <MyActivityListItem
        actions={[
          <Fragment key={survey.id}>
            <ZUIButton
              label={
                hasMeaningfulContent
                  ? messages.activities.survey.editButton()
                  : messages.activities.survey.fillOutButton()
              }
              onClick={() => onSelectSurvey(survey.id)}
              variant="primary"
            />
            {hasMeaningfulContent && (
              //TODO: Create ZUI Component for Survey in progress label
              <>
                <ZUIButton
                  label={messages.activities.survey.clearButton()}
                  onClick={() => setClearModalOpen(true)}
                  variant="secondary"
                />
                <Box
                  sx={(theme) => ({
                    alignItems: 'center',
                    bgcolor: theme.palette.swatches.blue[100],
                    borderRadius: 4,
                    color: theme.palette.swatches.blue[900],
                    display: 'inline-flex',
                    pointerEvents: 'none',
                    px: 1,
                    py: 0.3,
                    textAlign: 'center',
                  })}
                >
                  <ZUIText color="inherit" variant="bodySmRegular">
                    <Msg id={messageIds.activities.survey.inProgress} />
                  </ZUIText>
                </Box>
              </>
            )}
          </Fragment>,
        ]}
        iconTitle={Assignment}
        info={[
          {
            Icon: GroupWorkOutlined,
            labels: [
              survey.campaign?.title ?? messages.activities.untitled.project(),
              survey.organization.title,
            ],
          },
        ]}
        title={survey.title ?? messages.activities.untitled.survey()}
      />
      <ZUIModal
        open={clearModalOpen}
        primaryButton={{
          label: messages.activities.survey.clearButton(),
          onClick: () => {
            dispatch(surveySubmissionDeleted(survey.id));
            setClearModalOpen(false);
          },
        }}
        secondaryButton={{
          label: messages.activities.survey.cancelButton(),
          onClick: () => {
            setClearModalOpen(false);
          },
        }}
        size="small"
        title={messages.activities.survey.confirmClearSurvey({
          title: survey.title ?? messages.activities.untitled.survey(),
        })}
      />
    </>
  );
};

export default SurveyCard;
