import { FC, useState } from 'react';
import { Assignment, GroupWorkOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';

import MyActivityListItem from 'features/home/components/MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import SurveyModal from './SurveyModal';
import ZUILabel from 'zui/components/ZUILabel';
import ZUIText from 'zui/components/ZUIText';
import ClearResponsesModal from './ClearResponsesModal';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { surveySubmissionDeleted } from '../store';

type SurveyCardProps = {
  survey: ZetkinSurveyExtended;
};

const SurveyCard: FC<SurveyCardProps> = ({ survey }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clearResponsesModal, setClearResponsesModal] = useState(false);
  const dispatch = useAppDispatch();

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
              onClick={() => setModalOpen(true)}
              variant="primary"
            />
            {hasMeaningfulContent && (
              //TODO: Create ZUI Component for Survey in progress label
              <>
                <ZUIButton
                  key={survey.id}
                  label={'Clear responses'}
                  onClick={() => setClearResponsesModal(true)}
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
      <SurveyModal
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        survey={survey}
      />
      <ClearResponsesModal
        onClear={() => dispatch(surveySubmissionDeleted(survey.id))}
        onClose={() => setClearResponsesModal(false)}
        open={clearResponsesModal}
        survey={survey}
      />
    </>
  );
};

export default SurveyCard;
