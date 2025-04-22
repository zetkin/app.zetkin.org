'use client';

import { Box, Button, Divider } from '@mui/material';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
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

  return (
    <Box>
      <Box sx={{ backgroundColor: newTheme.palette.common.white }}>
        <Box
          pt={2}
          sx={{
            overflow: 'hidden',
            pl: { sm: 3, xs: 2 },
            pr: 2,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <ZUIText noWrap variant="headingMd">
            {assignment?.title || 'Untitled call assignment'}
          </ZUIText>
        </Box>

        <Box sx={{ px: { sm: 3, xs: 2 }, py: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: 1,
              gridTemplateColumns: '1fr auto',
              width: '100%',
            }}
          >
            <Box alignItems="center" display="flex" minWidth={0}>
              {assignment && (
                <Box alignItems="center" display="flex" sx={{ flexShrink: 0 }}>
                  <ZUIOrgAvatar
                    orgId={assignment.organization.id}
                    title={assignment.organization.title}
                  />
                </Box>
              )}

              <Box
                maxWidth="100%"
                minWidth={0}
                ml={1}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <ZUIText noWrap variant="bodySmRegular">
                  {assignment?.organization.title || 'Untitled organization'}
                </ZUIText>
              </Box>
            </Box>

            <Box display="flex">
              <Link href="/my/home" passHref>
                <Button sx={{ whiteSpace: 'nowrap' }} variant="outlined">
                  Quit
                </Button>
              </Link>
              <Button
                color="primary"
                sx={{ ml: 1, whiteSpace: 'nowrap' }}
                variant="contained"
              >
                Start calling
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box>{children}</Box>
    </Box>
  );
};

export default CallLayout;
