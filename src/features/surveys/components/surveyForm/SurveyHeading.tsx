import { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';

import SurveyContainer from './SurveyContainer';
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
  const searchParams = useSearchParams();
  const hideOrganization = searchParams?.get('hideOrganization');
  return (
    <Box>
      {hideOrganization !== 'true' && (
        <SurveyContainer padding={2}>
          <Box
            alignItems="center"
            columnGap={1}
            display="flex"
            flexDirection="row"
          >
            <ZUIAvatar
              size="md"
              url={`/api/orgs/${survey.organization.id}/avatar`}
            />
            {survey.organization.title}
          </Box>
        </SurveyContainer>
      )}

      <SurveyContainer bgcolor="background.default" padding={2}>
        <Typography component="h1" fontSize="2rem">
          {survey.title}
        </Typography>
        {survey.info_text && (
          <Typography color="grey.600" component="p">
            {survey.info_text}
          </Typography>
        )}
      </SurveyContainer>

      {status === 'error' && <SurveyErrorMessage />}
    </Box>
  );
};

export default SurveyHeading;
