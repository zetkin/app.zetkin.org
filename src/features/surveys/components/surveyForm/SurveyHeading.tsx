import { Box } from '@mui/material';
import { FC } from 'react';
import SurveyErrorMessage from './SurveyErrorMessage';
import ZUIAvatar from 'zui/ZUIAvatar';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';

export type SurveyHeadingProps = {
  status: ZetkinSurveyFormStatus;
  survey: ZetkinSurveyExtended;
};

const SurveyHeading: FC<SurveyHeadingProps> = ({ status, survey }) => {
  return (
    <Box>
      <Box alignItems="center" columnGap={1} display="flex" flexDirection="row">
        <ZUIAvatar
          size="md"
          url={`/api/orgs/${survey.organization.id}/avatar`}
        />
        {survey.organization.title}
      </Box>

      {status === 'error' && <SurveyErrorMessage />}

      <h1>{survey.title}</h1>

      {survey.info_text && <p>{survey.info_text}</p>}
    </Box>
  );
};

export default SurveyHeading;
