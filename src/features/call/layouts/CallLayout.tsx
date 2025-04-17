'use client';

import { AppBar, Box, Button, Toolbar, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import theme from 'zui/theme';
import ZUIText from 'zui/components/ZUIText';
import newTheme from 'zui/theme';
import ZUIOrgAvatar from 'zui/components/ZUIOrgAvatar';

type Props = {
  callAssId: string;
  children?: ReactNode;
};

const CallLayout: FC<Props> = ({ callAssId, children }) => {
  const assignments = useMyCallAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={1}
        position="static"
        sx={{ backgroundColor: newTheme.palette.common.white }}
      >
        <Box pt={2} sx={{ pl: { sm: 3, xs: 2 } }}>
          <ZUIText variant="headingMd">
            {assignment?.title
              ? isMobile && assignment.title.length > 30
                ? `${assignment.title.slice(0, 30)}...`
                : assignment.title
              : 'Untitled call assignment'}
          </ZUIText>
        </Box>
        <Toolbar>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Box alignItems="center" display="flex">
              {assignment && (
                <ZUIOrgAvatar
                  orgId={assignment.organization.id}
                  title={assignment.organization.title}
                />
              )}
              <Box ml={1}>
                <ZUIText variant="bodySmRegular">
                  {assignment?.organization.title
                    ? isMobile && assignment.organization.title.length > 20
                      ? `${assignment.organization.title.slice(0, 30)}...`
                      : assignment.organization.title
                    : 'Untitledorganization'}
                </ZUIText>
              </Box>
            </Box>
            <Box>
              <Link href="/my/home" passHref>
                <Button sx={{ mr: 1 }} variant="outlined">
                  Quit
                </Button>
              </Link>
              <Button color="primary" variant="contained">
                Start calling
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box>{children}</Box>
    </Box>
  );
};

export default CallLayout;
