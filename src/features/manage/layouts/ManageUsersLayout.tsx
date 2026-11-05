'use server';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import { BreadcrumbTreeItem } from 'zui/components/ZUIBreadcrumbs';
import ZUIHeader from 'zui/components/ZUIHeader';
import { ZUIPersonAvatarProps } from 'zui/components/ZUIPersonAvatar';

type Props = {
  avatar?: Omit<ZUIPersonAvatarProps, 'variant' | 'size'>;
  children: ReactNode;
  pathname: string;
  title: string;
};

const ManageUsersLayout: FC<Props> = ({
  avatar,
  children,
  title,
  pathname,
}) => {
  const pathParts = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathParts.reduceRight<BreadcrumbTreeItem[]>(
    (children, segment, index) => [
      {
        children,
        href: `/${pathParts.slice(0, index + 1).join('/')}`,
        title: segment,
      },
    ],
    []
  );

  const showBreadcrums =
    pathParts.length > 1 && (pathParts[1] !== 'users' || pathParts.length > 2);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="1rem"
      overflow="hidden"
      p="1rem"
    >
      <ZUIHeader
        avatar={avatar}
        breadcrumbs={showBreadcrums ? breadcrumbs : undefined}
        title={title}
      />
      {children}
    </Box>
  );
};

export default ManageUsersLayout;
