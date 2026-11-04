'use server';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import ZUIText from 'zui/components/ZUIText';
import ZUIBreadcrumbs, {
  BreadcrumbTreeItem,
} from 'zui/components/ZUIBreadcrumbs';

type Props = {
  children: ReactNode;
  pathname: string;
  title: string;
};

const ManageUsersLayout: FC<Props> = ({ children, title, pathname }) => {
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="1rem"
      overflow="hidden"
      p="1rem"
    >
      <Box alignItems="center" display="flex" flexDirection="row">
        {!!breadcrumbs[0].children.length && (
          <ZUIBreadcrumbs breadcrumbs={breadcrumbs} />
        )}
        <ZUIText variant="headingSm">{title}</ZUIText>
      </Box>
      {children}
    </Box>
  );
};

export default ManageUsersLayout;
