import { FC } from 'react';
import { Box } from '@mui/system';
import { HomeOutlined, MailOutline, Phone } from '@mui/icons-material';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUITagChip from 'zui/components/ZUITagChip';
import { ZetkinCall } from '../types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import PreviousCallsInfo from './PreviousCallsInfo';
import ZUIIcon from 'zui/components/ZUIIcon';
import useIsMobile from 'utils/hooks/useIsMobile';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type AboutSectionProps = {
  call: ZetkinCall | null;
};

export const AboutContent = ({ call }: { call: ZetkinCall }) => {
  const isMobile = useIsMobile();

  return (
    <>
      <Box>
        <Box display="flex" flex={1} flexDirection="column" gap={1}>
          {call.target.phone && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Phone} size="small" />
              <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <ZUIText>{call.target.phone}</ZUIText>
              </Box>
            </Box>
          )}
          {call.target.alt_phone && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Phone} size="small" />
              <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <ZUIText>{call.target.alt_phone}</ZUIText>
              </Box>
            </Box>
          )}
          {call.target.email && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={MailOutline} size="small" />
              <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <ZUIText>{call.target.email}</ZUIText>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          display={isMobile ? 'block' : 'flex'}
          flex={1}
          flexDirection="column"
          gap={1}
          mt={isMobile ? 1 : 0}
          paddingTop={1}
          sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
        >
          {(call.target.co_address || call.target.street_address) && (
            <Box
              alignItems="center"
              display="block"
              mt={isMobile ? 1 : 0}
              sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
            >
              <ZUIText display="flex">
                <ZUIIcon color="secondary" icon={HomeOutlined} size="small" />
                <ZUIText ml={1}>
                  {call.target.street_address}
                  <ZUIText display="block">
                    <ZUIText>{call.target.co_address} </ZUIText>
                    <ZUIText>{call.target.zip_code}</ZUIText>
                    <ZUIText>{call.target.city}</ZUIText>
                  </ZUIText>
                </ZUIText>
              </ZUIText>
            </Box>
          )}
        </Box>
      </Box>
      {call.target.tags.length > 0 && (
        <>
          <ZUIText variant="headingMd">
            <Msg id={messageIds.about.tagsHeader} />
          </ZUIText>
          <Box alignItems="center" display="flex" gap={1}>
            {call.target.tags.map((tag) => {
              return <ZUITagChip key={tag.id} tag={tag} />;
            })}
          </Box>
        </>
      )}
      <ZUIText variant="headingMd">
        <Msg id={messageIds.about.previousActivityHeader} />
      </ZUIText>
      {call.target.past_actions.num_actions > 0 && (
        <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
          <ZUIText component="span" display="inline">
            <Msg
              id={messageIds.about.participation}
              values={{
                events: (
                  <ZUIText display="inline" variant="bodyMdSemiBold">
                    <Msg
                      id={messageIds.about.events}
                      values={{
                        numEvents: call.target.past_actions.num_actions,
                      }}
                    />
                  </ZUIText>
                ),
                name: call.target.first_name,
                titleAndTime: (
                  <>
                    <ZUIText display="inline" variant="bodyMdSemiBold">
                      {call.target.past_actions.last_action?.title}
                    </ZUIText>{' '}
                    <ZUIRelativeTime
                      datetime={
                        call.target.past_actions.last_action?.end_time || ''
                      }
                    />
                  </>
                ),
              }}
            />
          </ZUIText>
        </Box>
      )}
      {call.target.past_actions.num_actions == 0 && (
        <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
          <ZUIText color="secondary">
            <Msg
              id={messageIds.about.noParticipation}
              values={{ name: call.target.first_name }}
            />
          </ZUIText>
        </Box>
      )}
      <PreviousCallsInfo call={call} />
    </>
  );
};

const AboutSection: FC<AboutSectionProps> = ({ call }) => {
  const messages = useMessages(messageIds);
  return (
    <ZUISection
      borders={false}
      fullHeight
      renderContent={() => {
        if (!call) {
          return <Box sx={{ height: '200px' }} />;
        }

        return <AboutContent call={call} />;
      }}
      title={messages.about.title({ name: call?.target.name || '' })}
    />
  );
};

export default AboutSection;
