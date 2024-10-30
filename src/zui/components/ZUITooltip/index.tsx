import { Tooltip } from '@mui/material';
import { FC, ReactElement } from 'react';

import { ZUIPlacement } from '../types';

type ZUITooltipProps = {
  /**
   * If the tooltip should have a small arrow or not. Defaults to 'true'
   */
  arrow?: boolean;

  children: ReactElement;

  /**
   * The text content of the tooltip
   */
  label: string;

  /**
   * Where the tooltip should attach in relation to its children.
   *
   * If the available space is not enough to show the tooltip at the given placement
   * it will automatically change to show at the opposite side on the same axis.
   *
   * For example, if placement is set to 'top' but the child element is too close
   * to either the top of the screen or an ancestor with hidden overflow,
   * the tooltip will instead render below the child element.
   */
  placement: ZUIPlacement;
};

const ZUITooltip: FC<ZUITooltipProps> = ({
  children,
  arrow = true,
  placement,
  label,
}) => {
  const getPlacement = () => {
    if (placement == 'end') {
      return 'right';
    } else if (placement == 'start') {
      return 'left';
    } else {
      return placement;
    }
  };

  return (
    <Tooltip arrow={arrow} placement={getPlacement()} title={label}>
      {children}
    </Tooltip>
  );
};

export default ZUITooltip;
