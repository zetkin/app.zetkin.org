'use client';

import { Box } from '@mui/material';
import { FC, ReactNode, Suspense } from 'react';
import NextLink from 'next/link';

import { ZetkinCampaign, ZetkinOrganization } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
  proj: ZetkinCampaign;
};

const PublicProjectLayout: FC<Props> = ({ children, org, proj }) => {
  return (
    <Box
      sx={{
        marginX: 'auto',
        maxWidth: 960,
      }}
    >
      <ActivistPortalHeader
        subtitle={proj.info_text}
        title={proj.title}
        topLeftComponent={
          <NextLink href={`/o/${org.id}`} passHref>
            <Box sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
              <ZUIOrgLogoAvatar orgId={org.id} size="small" />
              <ZUIText>{org.title}</ZUIText>
            </Box>
          </NextLink>
        }
      />
      <Suspense
        fallback={
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            height="90dvh"
            justifyContent="center"
          >
            <ZUILogoLoadingIndicator />
          </Box>
        }
      >
        <Box minHeight="90dvh" paddingX={2}>
          {children}
        </Box>
      </Suspense>
      <ZUIPublicFooter />
    </Box>
  );
};

export default PublicProjectLayout;
