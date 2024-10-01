import { Tooltip, TooltipProps } from '@mui/material';
import { FC, ReactElement } from 'react';

export interface ZUITooltipProps {
  children: ReactElement;
  arrow?: 'None' | 'Up' | 'Down' | 'Left' | 'Right';
  label: string;
}

const ZUITooltip: FC<ZUITooltipProps> = ({ children, arrow, label }) => {
  let showArrow = true;
  let placement: TooltipProps['placement'] = 'top';
  if (arrow == 'None') {
    showArrow = false;
    placement = 'top';
  } else if (arrow == 'Up') {
    placement = 'bottom';
  } else if (arrow == 'Down') {
    placement = 'top';
  } else if (arrow == 'Left') {
    placement = 'right';
  } else if (arrow == 'Right') {
    placement = 'left';
  }

  return (
    <Tooltip arrow={showArrow} placement={placement} title={label}>
      {children}
    </Tooltip>
  );
};

export default ZUITooltip;
