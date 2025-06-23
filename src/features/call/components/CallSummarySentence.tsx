import { FC } from 'react';

import { ZetkinCall } from '../types';
import ZUIText from 'zui/components/ZUIText';
import { useAppSelector } from 'core/hooks';

type Props = {
  call: ZetkinCall;
};

const CallSummarySentence: FC<Props> = ({ call }) => {
  const report = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].report
  );

  const messageByStatusCode: Record<number, string> = {
    1: `You talked to ${call.target.first_name}`,
    11: `${call.target.first_name} did not pick up, you did not leve a message.`,
    12: 'The line was busy',
    13: `You reached ${call.target.first_name}, but we have to call them back.`,
    14: `We will call ${call.target.first_name} back.`,
    15: `${call.target.first_name} did not pick up, you left a message on their answering machine.`,
    21: `We had the wrong number for ${call.target.first_name}`,
  };

  if (!report) {
    return null;
  }

  return (
    <ZUIText variant="bodyMdSemiBold">
      {messageByStatusCode[report.state]}
    </ZUIText>
  );
};

export default CallSummarySentence;
