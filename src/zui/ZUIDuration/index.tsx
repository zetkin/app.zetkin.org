import { FC } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';

type Props = {
  /**
   * The duration in seconds that should be visualized. Only positive durations
   * are supported and negative values will result in no rendered output.
   */
  seconds: number;
  withDays?: boolean;
  withHours?: boolean;
  withMinutes?: boolean;
  withSeconds?: boolean;
  withThousands?: boolean;
};

type DurField = {
  msgId: keyof typeof messageIds.duration;
  n: number;
  visible: boolean;
};

const ZUIDuration: FC<Props> = ({
  withDays = true,
  withHours = true,
  withThousands = false,
  withMinutes = true,
  withSeconds = false,
  seconds,
}) => {
  const ms = (seconds * 1000) % 1000;
  const s = Math.floor(seconds) % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 60 / 60) % 24;
  const days = Math.floor(seconds / 60 / 60 / 24);

  const fields: DurField[] = [
    { msgId: 'days', n: days, visible: withDays },
    { msgId: 'h', n: h, visible: withHours },
    { msgId: 'm', n: m, visible: withMinutes },
    { msgId: 's', n: s, visible: withSeconds },
    { msgId: 'ms', n: ms, visible: withThousands },
  ];

  return (
    <>
      {fields
        .filter((field) => field.visible)
        .filter((field) => field.n > 0)
        .map((field, index, array) => (
          <span key={field.msgId}>
            <Msg
              id={messageIds.duration[field.msgId]}
              values={{ n: field.n }}
            />
            {/* Add a space after the hours field */}
            {field.msgId === 'h' && index < array.length - 1 && ' '}
          </span>
        ))}
    </>
  );
};

export default ZUIDuration;
