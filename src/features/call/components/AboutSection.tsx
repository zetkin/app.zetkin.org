import { FC } from 'react';
import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import { HomeOutlined, MailOutline, Phone } from '@mui/icons-material';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUITagChip from 'zui/components/ZUITagChip';
import { UnfinishedCall } from '../types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import PreviousCallsInfo from './PreviousCallsInfo';
import ZUIIcon from 'zui/components/ZUIIcon';
import useIsMobile from 'utils/hooks/useIsMobile';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';
import ZUITooltip from 'zui/components/ZUITooltip';

type AboutSectionProps = {
  call: UnfinishedCall | null;
};

export const AboutContent = ({ call }: { call: UnfinishedCall }) => {
  const isMobile = useIsMobile();

  return (
    <Stack gap={1}>
      <Box>
        <Box display="flex" flex={1} flexDirection="column" gap={1}>
          {call.target.phone && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Phone} size="small" />
              <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <ZUIText sx={{ fontFamily: 'monospace' }}>
                  {call.target.phone}
                </ZUIText>
              </Box>
            </Box>
          )}
          {call.target.alt_phone && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Phone} size="small" />
              <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <ZUIText sx={{ fontFamily: 'monospace' }}>
                  {call.target.alt_phone}
                </ZUIText>
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
        <ZUIResponsiveContainer ssrWidth={300}>
          {(width) => {
            const tags = call.target.tags;
            const maxTags = Math.floor(width / 100);
            const displayedTags = tags.slice(0, maxTags);
            const hiddenTags = tags.slice(maxTags);

            const tooltipTitle = hiddenTags.map((tag) => tag.title).join(', ');

            return (
              <Box sx={{ paddingBottom: 0.5 }}>
                <ZUIText variant="headingMd">
                  <Msg id={messageIds.about.tagsHeader} />
                </ZUIText>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    paddingTop: 1,
                  }}
                >
                  {displayedTags.map((tag) => (
                    <ZUITagChip key={tag.id} tag={tag} />
                  ))}
                  {hiddenTags.length > 0 && (
                    <ZUITooltip label={tooltipTitle}>
                      <Box
                        border={2}
                        sx={(theme) => ({
                          alignItems: 'center',
                          borderColor: theme.palette.grey[500],
                          borderRadius: '1em',
                          borderWidth: '1px',
                          color: theme.palette.text.secondary,
                          cursor: 'default',
                          display: 'flex',
                          height: '30.4px',
                          lineHeight: 'normal',
                          marginRight: '0.1em',
                          overflow: 'hidden',
                          padding: '0.2em 0.7em',
                          textOverflow: 'ellipsis',
                        })}
                      >
                        <ZUIText>
                          {`${displayedTags.length > 0 ? '+' : ''}${hiddenTags.length}`}
                        </ZUIText>
                      </Box>
                    </ZUITooltip>
                  )}
                </Box>
              </Box>
            );
          }}
        </ZUIResponsiveContainer>
      )}
      <Box>
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
                  time: (
                    <ZUIRelativeTime
                      datetime={
                        call.target.past_actions.last_action?.end_time || ''
                      }
                    />
                  ),
                  title: (
                    <ZUIText display="inline" variant="bodyMdSemiBold">
                      {call.target.past_actions.last_action?.title}
                    </ZUIText>
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
      </Box>
      <PreviousCallsInfo call={call} />
    </Stack>
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
