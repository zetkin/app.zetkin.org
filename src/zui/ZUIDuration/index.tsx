import { FC } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';

type Props = {
  enableDays?: boolean;
  enableHours?: boolean;
  enableMilliseconds?: boolean;
  enableMinutes?: boolean;
  enableSeconds?: boolean;
  seconds: number;
};

type DurField = {
  msgId: keyof typeof messageIds.duration;
  n: number;
  visible: boolean;
};

const ZUIDuration: FC<Props> = ({
  enableDays = true,
  enableHours = true,
  enableMilliseconds = false,
  enableMinutes = true,
  enableSeconds = false,
  seconds,
}) => {
  const ms = (seconds * 1000) % 1000;
  const s = Math.floor(seconds) % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 60 / 60) % 24;
  const days = Math.floor(seconds / 60 / 60 / 24);

  const fields: DurField[] = [
    { msgId: 'days', n: days, visible: enableDays },
    { msgId: 'h', n: h, visible: enableHours },
    { msgId: 'm', n: m, visible: enableMinutes },
    { msgId: 's', n: s, visible: enableSeconds },
    { msgId: 'ms', n: ms, visible: enableMilliseconds },
  ];

  return (
    <>
      {fields
        .filter((field) => field.visible)
        .filter((field) => field.n > 0)
        .map((field) => (
          <span key={field.msgId} style={{ marginRight: 4 }}>
            <Msg
              id={messageIds.duration[field.msgId]}
              values={{ n: field.n }}
            />
          </span>
        ))}
    </>
  );
};

export default ZUIDuration;
