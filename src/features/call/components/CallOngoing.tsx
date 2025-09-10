'use client';

import { FC } from 'react';
import { Box } from '@mui/system';

import ActivitiesSection from './ActivitiesSection';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useCurrentCall from '../hooks/useCurrentCall';
import AboutSection from './AboutSection';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIMarkdown from 'zui/ZUIMarkdown';

type CallOngoingProps = {
  assignment: ZetkinCallAssignment;
};

const CallOngoing: FC<CallOngoingProps> = ({ assignment }) => {
  assignment;
  const call = useCurrentCall();
  const isMobile = useIsMobile();

  if (!call) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      height="calc(100% - 127px)" //TODO: Change this if/when header height is updated
      maxWidth="100%"
    >
      <Box
        sx={{ flex: 1, height: '100%', maxHeight: '100%', overflowY: 'auto' }}
      >
        <ZUISection
          borders={false}
          fullHeight
          renderContent={() => (
            <ZUIText component="div">
              {assignment.instructions ? (
                <ZUIMarkdown markdown={assignment.instructions} />
              ) : (
                "This assignment doesn't have instructions."
              )}
            </ZUIText>
          )}
          title={'Instructions'}
        />{' '}
      </Box>
      <ZUIDivider flexItem orientation="vertical" />
      <Box
        sx={{ flex: 1, height: '100%', maxHeight: '100%', overflowY: 'auto' }}
      >
        <AboutSection call={call} />
      </Box>
      <ZUIDivider flexItem orientation="vertical" />
      <Box
        sx={{ flex: 1, maxHeight: '100%', maxWidth: 1 / 3, overflowY: 'auto' }}
      >
        <ActivitiesSection assignment={assignment} target={call.target} />
      </Box>
    </Box>
  );
};

export default CallOngoing;
