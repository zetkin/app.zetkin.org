import { FC } from 'react';

import ZUITooltip from '../ZUITooltip';

type ZUISuffixedNumberProps = {
  number: number;
};

const ZUISuffixedNumber: FC<ZUISuffixedNumberProps> = ({ number }) => {
  return (
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
};

export default ZUISuffixedNumber;
