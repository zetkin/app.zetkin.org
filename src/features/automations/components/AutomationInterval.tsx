import { FC } from 'react';

import useAutomationInterval from '../hooks/useAutomationInterval';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  seconds: number;
};

const AutomationInterval: FC<Props> = ({ seconds }) => {
  const { unit, value } = useAutomationInterval(seconds);

  return (
    <Msg id={messageIds.labels.schedule.interval[unit]} values={{ value }} />
  );
};

export default AutomationInterval;
