import { FC } from 'react';
import { Divider } from '@mui/material';

import { ZUIOrientation } from '../types';

type ZUIDividerProps = {
  /**
   * This should be set to "true" if the divider
   * is inside a flex container.
   *
   * Defaults to "false".
   */
  flexItem?: boolean;

  /**
   * The orientation of the component.
   * Defaults to "horizontal";
   */
  orientation?: ZUIOrientation;

  /**
   * The variant of the divider. Defaults to 'fullWidth'
   */
  variant?: 'middle' | 'fullWidth';
};

/**
 * Remember that if this divider is inside a
 * flex container, you need to set "flexItem" to true.
 */
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
