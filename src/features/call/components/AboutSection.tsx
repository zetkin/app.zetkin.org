import { FC } from 'react';
import { Box } from '@mui/system';

import ZUISection from 'zui/components/ZUISection';
import TargetInfo from './TargetInfo';
import ZUIText from 'zui/components/ZUIText';
import ZUITagChip from 'zui/components/ZUITagChip';
import { ZetkinCall } from '../types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import PreviousCallsInfo from './PreviousCallsInfo';

type AboutSectionProps = {
  call: ZetkinCall;
};

const AboutSection: FC<AboutSectionProps> = ({ call }) => {
  return (
    <ZUISection
      renderContent={() => (
        <>
          <TargetInfo call={call} />
          {call.target.tags.length > 0 && (
            <>
              <ZUIText variant="headingMd">Tags</ZUIText>
              <Box alignItems="center" display="flex" gap={1}>
                {call.target.tags.map((tag) => {
                  return <ZUITagChip key={tag.id} tag={tag} />;
                })}
              </Box>
            </>
          )}
          <ZUIText variant="headingMd">Previous activity</ZUIText>
          {call.target.past_actions.num_actions > 0 && (
            <ZUIText display="inline">
              {`${call.target.first_name} participated in `}
              <ZUIText display="inline" variant="bodyMdSemiBold">
                {call.target.past_actions.num_actions} actions
              </ZUIText>
              {`, the most recent being `}
              <ZUIText display="inline" variant="bodyMdSemiBold">
                {call.target.past_actions.last_action?.title}
              </ZUIText>{' '}
              <ZUIRelativeTime
                datetime={call.target.past_actions.last_action?.end_time || ''}
              />
              .
            </ZUIText>
          )}
          {call.target.past_actions.num_actions == 0 && (
            <ZUIText color="secondary">{`${call.target.first_name} never participated in any actions.`}</ZUIText>
          )}
          <PreviousCallsInfo call={call} />
        </>
      )}
      title={`About ${call.target.first_name} ${call.target.last_name}`}
    />
  );
};

export default AboutSection;
