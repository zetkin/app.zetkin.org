import { FC, useState } from 'react';
import { Assignment, GroupWorkOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';

import MyActivityListItem from 'features/home/components/MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import ZUILabel from 'zui/components/ZUILabel';
import ZUIText from 'zui/components/ZUIText';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import ZUIModal from 'zui/components/ZUIModal';
import { surveySubmissionDeleted } from '../store';

type SurveyCardProps = {
  onSelectSurvey: (surveyId: number) => void;
  survey: ZetkinSurveyExtended;
};

const SurveyCard: FC<SurveyCardProps> = ({ survey, onSelectSurvey }) => {
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
          <>
            <ZUIButton
              key={survey.id}
              label={hasMeaningfulContent ? 'Edit responses' : 'Fill out'}
              onClick={() => onSelectSurvey(survey.id)}
              variant="primary"
            />
            {hasMeaningfulContent && (
              //TODO: Create ZUI Component for Survey in progress label
              <>
                <ZUIButton
                  key={survey.id}
                  label={'Clear responses'}
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
                  <ZUILabel color="inherit">
                    <ZUIText color="inherit" variant="bodySmRegular">
                      {'Survey in progress'}
                    </ZUIText>
                  </ZUILabel>
                </Box>
              </>
            )}
          </>,
        ]}
        iconTitle={Assignment}
        info={[
          {
            Icon: GroupWorkOutlined,
            labels: [
              survey.campaign?.title ?? 'Untitled project',
              survey.organization.title,
            ],
          },
        ]}
        title={survey.title ?? 'Untitled Survey'}
      />
      <ZUIModal
        open={clearModalOpen}
        primaryButton={{
          label: 'Clear responses',
          onClick: () => {
            dispatch(surveySubmissionDeleted(survey.id));
            setClearModalOpen(false);
          },
        }}
        secondaryButton={{
          label: 'Cancel',
          onClick: () => {
            setClearModalOpen(false);
          },
        }}
        size="small"
        title={`Do you want to remove the responses for ${survey.title} ?`}
      />
    </>
  );
};

export default SurveyCard;
