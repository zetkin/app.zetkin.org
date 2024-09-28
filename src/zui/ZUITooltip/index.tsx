import { Tooltip, TooltipProps, Button } from '@mui/material';
import { FC } from 'react';

export interface ZUITooltipProps {
    arrow?: 'None' | 'Up' | 'Down' | 'Left' | 'Right';
    label: string;
}

const ZUITooltip: FC<ZUITooltipProps> = ({
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
            <Button>
                {label}
            </Button>
        </Tooltip>
    );
  };
  
export default ZUITooltip;