import { FC } from 'react';
import SurveyErrorMessage from './SurveyErrorMessage';
import ZUIAvatar from 'zui/ZUIAvatar';
import { Box, Typography } from '@mui/material';
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
      <Box
        alignItems="center"
        columnGap={1}
        display="flex"
        flexDirection="row"
        padding={1}
      >
        <ZUIAvatar
          size="md"
          url={`/api/orgs/${survey.organization.id}/avatar`}
        />
        {survey.organization.title}
      </Box>

      {status === 'error' && <SurveyErrorMessage />}

      <Box bgcolor="background.default" padding={2}>
        <Typography component="h1" fontSize="2rem">
          {survey.title}
        </Typography>
        {survey.info_text && (
          <Typography color="grey.600" component="p">
            {survey.info_text}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SurveyHeading;
