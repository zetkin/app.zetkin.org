'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';

type Props = {
  children: ReactNode;
  survey: ZetkinSurveyExtended;
};

const PublicSurveyLayout: FC<Props> = ({ children, survey }) => {
  const searchParams = useSearchParams();
  const showOrganization = searchParams?.get('hideOrganization') != 'true';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ flex: 1, maxWidth: 'sm', padding: 2, width: '100%' }}>
          {showOrganization && (
            <Box
              alignItems="center"
              columnGap={1}
              display="flex"
              flexDirection="row"
            >
              <ZUIOrgLogoAvatar orgId={survey.organization.id} size="md" />
              <ZUIText>{survey.organization.title}</ZUIText>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <ZUIText variant="headingLg">{survey.title}</ZUIText>
            {survey.info_text && (
              <ZUIText color="secondary">{survey.info_text}</ZUIText>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <ZUIPublicFooter />
    </Box>
  );
};

export default PublicSurveyLayout;
