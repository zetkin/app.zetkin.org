import { FC } from 'react';
import { Box } from '@mui/system';
import {
  Fingerprint,
  HomeOutlined,
  MailOutline,
  Phone,
  Transgender,
} from '@mui/icons-material';

import ZUIText from 'zui/components/ZUIText';
import { ZetkinCall } from '../types';
import ZUIIcon from 'zui/components/ZUIIcon';
import useIsMobile from 'utils/hooks/useIsMobile';

type TargetInfoProps = {
  call: ZetkinCall;
};

const TargetInfo: FC<TargetInfoProps> = ({ call }) => {
  const isMobile = useIsMobile();
  return (
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
  );
};

export default TargetInfo;
