import { FC, useState } from 'react';
import { Assignment, GroupWorkOutlined } from '@mui/icons-material';

import MyActivityListItem from 'features/home/components/MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import SurveyModal from './SurveyModal';

type SurveyCardProps = {
  survey: ZetkinSurveyExtended;
  targetId: number;
};

const SurveyCard: FC<SurveyCardProps> = ({ survey, targetId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <MyActivityListItem
        actions={[
          <ZUIButton
            key={survey.id}
            label={'Fill out'}
            onClick={() => setModalOpen(true)}
            variant="primary"
          />,
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
