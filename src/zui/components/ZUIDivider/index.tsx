import { FC } from 'react';
import { Divider, DividerProps } from '@mui/material';

type ZUIDividerProps = Partial<
  Pick<DividerProps, 'flexItem' | 'orientation'>
> & {
  /**
   * The variant of the divider. Defaults to 'fullWidth'
   */
  variant?: 'middle' | 'fullWidth';
};

const ZUIDivider: FC<ZUIDividerProps> = ({
  flexItem,
  orientation = 'horizontal',
  variant = 'fullWidth',
}) => (
  <Divider
    flexItem={flexItem}
    orientation={orientation}
    sx={(theme) => ({ color: theme.palette.dividers.main })}
    variant={variant}
  />
);

export default ZUIDivider;
