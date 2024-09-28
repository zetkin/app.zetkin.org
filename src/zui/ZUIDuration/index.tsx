import { FC } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';

type Props = {
  /**
   * The duration in seconds that should be visualized. Only positive durations
   * are supported and negative values will result in no rendered output.
   */
  seconds: number;

  /**
   * The upper range unit of time to display the duration in.
   */
  upperTimeUnit?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';

  /**
   * The lower range unit of time to display the duration in.
   */
  lowerTimeUnit?: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';
};

type DurField = {
  msgId: keyof typeof messageIds.duration;
  n: number;
  visible: boolean;
};

const timeUnitMap = new Map([
  ['milliseconds', 0],
  ['seconds', 1],
  ['minutes', 2],
  ['hours', 3],
  ['days', 4],
] as const);

const ZUIDuration: FC<Props> = ({
  upperTimeUnit = 'days',
  lowerTimeUnit = 'minutes',
  seconds,
}) => {
  var upper = timeUnitMap.get(upperTimeUnit) ?? 4;
  var lower = timeUnitMap.get(lowerTimeUnit) ?? 2;

  if (upper < lower) {
    upper = lower;
  }

  var timeUnits = [...timeUnitMap.keys()].filter(
    (timeUnit) =>
      (timeUnitMap.get(timeUnit) ?? 0) <= upper &&
      (timeUnitMap.get(timeUnit) ?? 0) >= lower
  );

  const minutesToSecondsFactor = 60;
  const hoursToSecondsFactor = 60 * minutesToSecondsFactor;
  const daysToSecondsFactor = 24 * hoursToSecondsFactor;

  const days = timeUnits.includes('days')
    ? Math.floor(Math.floor(seconds) / daysToSecondsFactor)
    : 0;

  const h = timeUnits.includes('hours')
    ? Math.floor(
        (Math.floor(seconds) - days * daysToSecondsFactor) /
          hoursToSecondsFactor
      )
    : 0;

  const m = timeUnits.includes('minutes')
    ? Math.floor(
        (Math.floor(seconds) -
          days * daysToSecondsFactor -
          h * hoursToSecondsFactor) /
          minutesToSecondsFactor
      )
    : 0;

  const s = timeUnits.includes('seconds')
    ? Math.floor(
        Math.floor(seconds) -
          days * daysToSecondsFactor -
          h * hoursToSecondsFactor -
          m * minutesToSecondsFactor
      )
    : 0;

  const ms = Math.round(
    (seconds -
      days * daysToSecondsFactor -
      h * hoursToSecondsFactor -
      m * minutesToSecondsFactor -
      s) *
      1000
  );

  const fields: DurField[] = [
    {
      msgId: 'days',
      n: days,
      visible: timeUnits.includes('days'),
    },
    {
      msgId: 'h',
      n: h,
      visible: timeUnits.includes('hours'),
    },
    {
      msgId: 'm',
      n: m,
      visible: timeUnits.includes('minutes'),
    },
    {
      msgId: 's',
      n: s,
      visible: timeUnits.includes('seconds'),
    },
    {
      msgId: 'ms',
      n: ms,
      visible: timeUnits.includes('milliseconds'),
    },
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
