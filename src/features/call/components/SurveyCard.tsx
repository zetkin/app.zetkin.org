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
import useLocalStorage from 'zui/hooks/useLocalStorage';

type SurveyCardProps = {
  isReport?: boolean;
  survey: ZetkinSurveyExtended;
  targetId: number;
};

const SurveyCard: FC<SurveyCardProps> = ({ isReport, survey, targetId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clearResponsesModal, setClearResponsesModal] = useState(false);

  const [formContent] = useLocalStorage<Record<string, string | string[]>>(
    `formContent-${survey.id}-${targetId}`,
    {}
  );

  const hasResponses = Object.keys(formContent).length > 0;

  return (
    <>
      <MyActivityListItem
        actions={[
          <>
            <ZUIButton
              key={survey.id}
              label={hasResponses ? 'Edit responses' : 'Fill out'}
              onClick={() => setModalOpen(true)}
              variant="primary"
            />
            {isReport && hasResponses && (
              <ZUIButton
                key={survey.id}
                label={'Clear responses'}
                onClick={() => setClearResponsesModal(true)}
                variant="secondary"
              />
            )}

            {hasResponses && (
              //TODO: Create ZUI Component for Survey in progress label
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
      <ClearResponsesModal
        onClose={() => setClearResponsesModal(false)}
        open={clearResponsesModal}
        survey={survey}
        targetId={targetId}
      />
    </>
  );
};

export default SurveyCard;
