import { FC } from 'react';
import { Assignment, GroupWorkOutlined } from '@mui/icons-material';

import MyActivityListItem from 'features/home/components/MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

type SurveyCardProps = {
  survey: ZetkinSurveyExtended;
};

const SurveyCard: FC<SurveyCardProps> = ({ survey }) => {
  return (
    <MyActivityListItem
      actions={[
        <ZUIButton key={survey.id} label={'Fill out'} variant="primary" />,
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
  );
};

export default SurveyCard;
