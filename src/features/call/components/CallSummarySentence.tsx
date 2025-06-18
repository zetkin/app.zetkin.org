import { FC } from 'react';

import useCallState from '../hooks/useCallState';
import { ZetkinCall } from '../types';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  call: ZetkinCall;
};

const CallSummarySentence: FC<Props> = ({ call }) => {
  const callState = useCallState(call.id);
  const report = callState?.report;

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
    <ZUISection
      renderContent={() => (
        <ZUIText variant="bodyMdSemiBold">
          {messageByStatusCode[report.state]}
        </ZUIText>
      )}
      title="Summary"
    />
  );
};

export default CallSummarySentence;
