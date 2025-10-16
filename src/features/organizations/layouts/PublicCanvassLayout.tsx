'use client';

import { Box } from '@mui/system';
import { FC, PropsWithChildren, useMemo } from 'react';
import NextLink from 'next/link';

import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import useIsMobile from 'utils/hooks/useIsMobile';
import { removeOffset } from 'utils/dateUtils';
import useMyAreaAssignments from '../../canvass/hooks/useMyAreaAssignments';
import useOrganization from '../hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import ZUILink from '../../../zui/components/ZUILink';

type Props = PropsWithChildren<{
  areaAssId: number;
}>;

export const PublicCanvassLayout: FC<Props> = ({ children, areaAssId }) => {
  const assignments = useMyAreaAssignments();
  const assignment = useMemo(
    () => assignments.find((assignment) => assignment.id == areaAssId),
    [assignments, areaAssId]
  );

  const orgFuture = useOrganization(assignment.organization_id);

  const messages = useMessages(messageIds);
  const isMobile = useIsMobile();

  const subtitle = useMemo(() => {
    if (!assignment.start_date || !assignment.end_date) {
      return undefined;
    }

    return (
      <Box
        sx={{
          alignItems: isMobile ? 'flex-start' : 'center',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1,
        }}
      >
        <ZUIText>
          {
            <ZUITimeSpan
              end={new Date(removeOffset(assignment.end_date))}
              start={new Date(removeOffset(assignment.start_date))}
            />
          }
        </ZUIText>
      </Box>
    );
  }, [assignment]);

  return (
    <ZUIFutures futures={{ org: orgFuture }}>
      {({ data: { org } }) => (
        <Box
          sx={{
            minHeight: '100dvh',
          }}
        >
          <Box
            sx={{
              marginX: 'auto',
              maxWidth: 960,
            }}
          >
            <Box bgcolor="white">
              <ActivistPortalHeader
                subtitle={subtitle}
                title={assignment.title || messages.eventPage.defaultTitle()}
                topLeftComponent={
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'inline-flex',
                      gap: 1,
                    }}
                  >
                    <ZUIOrgLogoAvatar
                      orgId={assignment.organization_id}
                      size="small"
                    />
                    <ZUILink
                      hoverUnderline={true}
                      href={`/o/${assignment.organization_id}`}
                      text={org.title ?? ''}
                    />
                  </Box>
                }
              />
            </Box>
            {children}
          </Box>
        </Box>
      )}
    </ZUIFutures>
  );
};
export default PublicCanvassLayout;
