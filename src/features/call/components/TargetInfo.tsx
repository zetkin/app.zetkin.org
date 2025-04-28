import { FC } from 'react';
import { Box } from '@mui/system';
import {
  Fingerprint,
  HomeOutlined,
  MailOutline,
  Phone,
} from '@mui/icons-material';

import ZUIText from 'zui/components/ZUIText';
import { ZetkinCall } from '../types';

type TargetInfoProps = {
  call: ZetkinCall;
};
const TargetInfo: FC<TargetInfoProps> = ({ call }) => {
  return (
    <Box display="flex" flexDirection="row" gap={2}>
      <Box display="flex" flex={1} flexDirection="column" gap={2}>
        {call.target.phone && (
          <Box alignItems="center" display="flex" gap={1}>
            <Phone
              sx={(theme) => ({
                color: theme.palette.secondary.light,
                fontSize: '1.3rem',
              })}
            />
            <ZUIText>{call.target.phone}</ZUIText>
          </Box>
        )}
        {call.target.alt_phone && (
          <Box alignItems="center" display="flex" gap={1}>
            <Phone
              sx={(theme) => ({
                color: theme.palette.secondary.light,
                fontSize: '1.3rem',
              })}
            />
            <ZUIText>{call.target.alt_phone}</ZUIText>
          </Box>
        )}
        {call.target.email && (
          <Box alignItems="center" display="flex" gap={1}>
            <MailOutline
              sx={(theme) => ({
                color: theme.palette.secondary.light,
                fontSize: '1.3rem',
              })}
            />
            <ZUIText>{call.target.email}</ZUIText>
          </Box>
        )}
        <Box alignItems="center" display="flex" gap={1}>
          <Fingerprint
            sx={(theme) => ({
              color: theme.palette.secondary.light,
              fontSize: '1.3rem',
            })}
          />
          <ZUIText>{call.target.id}</ZUIText>
        </Box>
      </Box>

      {(call.target.zip_code || call.target.city) && (
        <Box display="flex" flex={1} flexDirection="column" gap={2}>
          <Box alignItems="center" display="flex">
            <HomeOutlined
              sx={(theme) => ({
                color: theme.palette.secondary.light,
                fontSize: '1.3rem',
              })}
            />
            <ZUIText>{call.target.zip_code}</ZUIText>
            <ZUIText>{call.target.city}</ZUIText>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TargetInfo;
