import { Tooltip, TooltipProps, Button } from '@mui/material';
import { Box } from '@mui/system';
import { FC, ReactComponentElement, ReactElement, ReactNode } from 'react';

export interface ZUITooltipProps {
    children: ReactElement;
    arrow?: 'None' | 'Up' | 'Down' | 'Left' | 'Right';
    label: string;
}

const ZUITooltip: FC<ZUITooltipProps> = ({
    children,
    arrow,
    label
  }) => {
    let showArrow = true;
    let placement: TooltipProps["placement"] = 'top';
    if (arrow == 'None') {
      showArrow = false;
      placement = 'top';
    } else if (arrow == 'Up') {
      placement = 'top';
    } else if (arrow == 'Down') {
      placement = 'bottom';
    } else if (arrow == 'Left') {
      placement = 'right';
    } else if (arrow == 'Right') {
      placement = 'left';
    }

    return (
        <Tooltip title={label} placement={placement} arrow={showArrow}>
          {children}
        </Tooltip>
    );
  };
  
export default ZUITooltip;