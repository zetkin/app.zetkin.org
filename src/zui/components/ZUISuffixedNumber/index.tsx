import { FC } from 'react';

import ZUITooltip from '../ZUITooltip';

type ZUISuffixedNumberProps = {
  /**
   * The number to be suffixed.
   */
  number: number;
};

const ZUISuffixedNumber: FC<ZUISuffixedNumberProps> = ({ number }) => (
  <ZUITooltip label={number.toLocaleString()}>
    <span>
      {number.toLocaleString('en', {
        compactDisplay: 'short',
        maximumFractionDigits: 1,
        notation: 'compact',
      })}
    </span>
  </ZUITooltip>
);

export default ZUISuffixedNumber;
