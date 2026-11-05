'use server';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import ZUIHeader from 'zui/components/ZUIHeader';

type Props = {
  children: ReactNode;
  pathname: string;
  title: string;
};

const ManageUsersLayout: FC<Props> = ({ children, title }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="1rem"
      overflow="hidden"
      p="1rem"
    >
      <ZUIHeader title={title} />
      {children}
    </Box>
  );
};

export default ManageUsersLayout;
