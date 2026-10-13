import { HeadsetMicOutlined } from '@mui/icons-material';

import {
  colorByCallState,
  iconByCallState,
} from 'features/call/components/PreviousCallsInfo';
import {
  CallState,
  CallStateString,
  callStateToString,
  ZetkinCall,
} from 'features/call/types';
import { MUIIcon } from 'zui/components/types';

export type StateString = CallStateString | 'unfinished';
export const states: Record<ZetkinCall['state'], StateString> = {
  ...callStateToString,
  [CallState.UNFINISHED]: 'unfinished',
};
export const colors: Record<
  ZetkinCall['state'],
  'success' | 'warning' | 'error' | 'info'
> = { ...colorByCallState, [CallState.UNFINISHED]: 'info' };

export const icons: Record<ZetkinCall['state'], MUIIcon> = {
  ...iconByCallState,
  [CallState.UNFINISHED]: HeadsetMicOutlined,
};
