import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Button, SvgIconTypeMap } from '@mui/material';

import { getVariant, ZUIButtonProps } from 'zui/newDesignSystem/ZUIButton';

export type ZUIIconButtonProps = Omit<
  ZUIButtonProps,
  'endIcon' | 'fullWidth' | 'label' | 'startIcon'
> & {
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
};

const ZUIIconButton: FC<ZUIIconButtonProps> = ({
  actionType,
  disabled,
  icon: Icon,
  onClick,
  onKeyDown,
  size,
  variant,
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      size={size}
      type={actionType}
      variant={variant ? getVariant(variant) : undefined}
    >
      <Icon />
    </Button>
  );
};

export default ZUIIconButton;
