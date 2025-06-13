import { FC, useState } from 'react';
import { Assignment, GroupWorkOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';

import MyActivityListItem from 'features/home/components/MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import SurveyModal from './SurveyModal';
import ZUILabel from 'zui/components/ZUILabel';
import ZUIText from 'zui/components/ZUIText';
import { useAppSelector } from 'core/hooks';

type SurveyCardProps = {
  survey: ZetkinSurveyExtended;
  targetId: number;
};

const SurveyCard: FC<SurveyCardProps> = ({ survey, targetId }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const surveyList = useAppSelector((state) => state.call.filledSurveys || []);

  const isSurveyInProgress = surveyList.some(
    (item) => item.surveyId === survey.id && item.targetId === targetId
  );

  return (
    <>
      <MyActivityListItem
        actions={[
          <>
            <ZUIButton
              key={survey.id}
              label={'Fill out'}
              onClick={() => setModalOpen(true)}
              variant="primary"
            />
            {isSurveyInProgress && (
              //TODO: Create ZUIComponent
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
                })}
              >
                <ZUILabel color="inherit">
                  <ZUIText color="inherit" variant="bodySmRegular">
                    {'Survey in progress'}
                  </ZUIText>
                </ZUILabel>
              </Box>
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
        targetId={targetId}
      />
    </>
  );
};

export default SurveyCard;
