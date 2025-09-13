import { FC } from 'react';
import { Box } from '@mui/system';
import {
  Fingerprint,
  HomeOutlined,
  MailOutline,
  Phone,
  Transgender,
} from '@mui/icons-material';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUITagChip from 'zui/components/ZUITagChip';
import { ZetkinCall } from '../types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import PreviousCallsInfo from './PreviousCallsInfo';
import ZUIIcon from 'zui/components/ZUIIcon';
import useIsMobile from 'utils/hooks/useIsMobile';

type AboutSectionProps = {
  call: ZetkinCall | null;
};

export const AboutContent = ({ call }: { call: ZetkinCall }) => {
  const isMobile = useIsMobile();

  return (
    <>
      <Box display={isMobile ? 'block' : 'flex'} flexDirection="row" gap={2}>
        <Box display="flex" flex={1} flexDirection="column" gap={1}>
          {call.target.phone && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Phone} size="small" />
              <ZUIText>{call.target.phone}</ZUIText>
            </Box>
          )}
          {call.target.alt_phone && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Phone} size="small" />
              <ZUIText>{call.target.alt_phone}</ZUIText>
            </Box>
          )}
          {call.target.email && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={MailOutline} size="small" />
              <ZUIText>{call.target.email}</ZUIText>
            </Box>
          )}
          {call.target.ext_id && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Fingerprint} size="small" />
              <ZUIText>{call.target.ext_id}</ZUIText>
            </Box>
          )}
        </Box>
        <Box
          display={isMobile ? 'block' : 'flex'}
          flex={1}
          flexDirection="column"
          gap={1}
          mt={isMobile ? 1 : 0}
        >
          {call.target.gender && (
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIIcon color="secondary" icon={Transgender} size="small" />
              {call.target.gender == 'm' && <ZUIText>Male</ZUIText>}
              {call.target.gender == 'f' && <ZUIText>Female</ZUIText>}
              {call.target.gender == 'o' && <ZUIText>Other</ZUIText>}
              {call.target.gender == null && <ZUIText>Unknown</ZUIText>}
            </Box>
          )}
          {(call.target.co_address || call.target.street_address) && (
            <Box alignItems="center" display="block" mt={isMobile ? 1 : 0}>
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
  );
};

const AboutSection: FC<AboutSectionProps> = ({ call }) => {
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
      title={`About ${call?.target.first_name} ${call?.target.last_name}`}
    />
  );
};

export default AboutSection;
