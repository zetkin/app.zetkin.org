'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AllOrganizationsList from '../components/AllOrganizationsList';
import ZUIText from 'zui/components/ZUIText';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

const OrganizationsPage: FC = () => {
  const messages = useMessages(messageIds);

  return (
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
      <Box
        sx={{
          p: 2,
        }}
      >
        <ZUIText>{messages.organizationsList.explainer()}</ZUIText>
        <AllOrganizationsList />
      </Box>
    </Suspense>
  );
};

export default OrganizationsPage;
