import { FC } from 'react';

import { Msg } from 'core/i18n';
import { TIME_FRAME } from '../types';
import { TimeFrameConfig } from '../utils';

import messageIds from 'features/smartSearch/l10n/messageIds';

type DisplayTimeFrameProps = {
  config: TimeFrameConfig;
};

const DisplayTimeFrame: FC<DisplayTimeFrameProps> = ({
  config: timeFrameConfig,
}) => {
  const { after, before, numDays, timeFrame } = timeFrameConfig;

  const withAfter = {
    afterDate: after?.toISOString().slice(0, 10) ?? '',
  };
  const withBefore = {
    beforeDate: before?.toISOString().slice(0, 10) ?? '',
  };

  if (timeFrame == TIME_FRAME.AFTER_DATE) {
    return (
      <Msg
        id={messageIds.timeFrame.preview.afterDate}
        values={{
          ...withAfter,
        }}
      />
    );
  } else if (timeFrame == TIME_FRAME.BEFORE_DATE) {
    return (
      <Msg
        id={messageIds.timeFrame.preview.beforeDate}
        values={{
          ...withBefore,
        }}
      />
    );
  } else if (timeFrame == TIME_FRAME.BETWEEN) {
    return (
      <Msg
        id={messageIds.timeFrame.preview.between}
        values={{
          ...withAfter,
          ...withBefore,
        }}
      />
    );
  } else if (timeFrame == TIME_FRAME.LAST_FEW_DAYS) {
    return (
      <Msg
        id={messageIds.timeFrame.preview.lastFew}
        values={{
          days: numDays || 0,
        }}
      />
    );
  } else {
    return <Msg id={messageIds.timeFrame.preview[timeFrame]} />;
  }
};

export default DisplayTimeFrame;
