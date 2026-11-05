'use server';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { cookies } from 'next/headers';

import ManageSidebar from 'features/manage/components/ManageSidebar';
import oldTheme from 'theme';
import { ConfirmationDialogProvider } from 'features/manage/components/ConfirmationDialogContext';

type Props = {
  children: ReactNode;
  pathname: string;
  title: string;
};

const ManageLayout: FC<Props> = async ({ children, title, pathname }) => {
  const pathParts = pathname.split('/').filter(Boolean);

  const segment = pathParts[1] as 'users';

  const cookieList = await cookies();
  const sidebarOpenCookie = cookieList.get('sidebarOpen');
  const sidebarOpenInitialValue = sidebarOpenCookie
    ? (JSON.parse(sidebarOpenCookie.value) as boolean)
    : undefined;

  return (
    <Box
      display="flex"
      flexDirection="row"
      height="100vh"
      sx={{
        [oldTheme.breakpoints.down('sm')]: {
          paddingTop: '3.5rem',
        },
      }}
      width="100vw"
    >
      <ManageSidebar
        segment={segment}
        sidebarOpenInitialCookieValue={sidebarOpenInitialValue}
        title={title}
      />
      <Box display="flex" flex={1} flexDirection="column" overflow="hidden">
        <ConfirmationDialogProvider>{children}</ConfirmationDialogProvider>
      </Box>
    </Box>
  );
};

export default ManageLayout;
