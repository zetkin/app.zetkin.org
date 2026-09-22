import { Stack } from '@mui/material';
import { FC, ReactElement } from 'react';

import ZUIColumn from '../ZUIColumn';

type ZUIColumnOrFalsy =
  | ReactElement<typeof ZUIColumn>
  | null
  | undefined
  | boolean;

type Props = {
  /**
   * ZUIColumns to be rendered within the row as vertical columns.
   * It is restricted to be a single ZUIColumn or an array of ZUIColumns or falsy values.
   * The use of ZUIColumn ensures proper layout and responsiveness within the ZUIRow.
   *
   *
   * @example
   * <ZUIRow>
   *   <ZUIColumn>Column 1</ZUIColumn>
   *   <ZUIColumn>Column 2</ZUIColumn>
   *   { hasThreeColumns && <ZUIColumn>Conditional Column 3</ZUIColumn> }
   * </ZUIRow>
   */
  children?: ZUIColumnOrFalsy | ZUIColumnOrFalsy[];
};

const ZUIRow: FC<Props> = ({ children }) => (
  <Stack
    direction="row"
    sx={(theme) => ({
      '--parentColumns': 12,
      '--parentSpacing': theme.spacing(2),
      alignItems: 'flex-start',
      containerType: 'inline-size',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 'var(--parentSpacing)',
    })}
    useFlexGap
  >
    {children}
  </Stack>
);

export default ZUIRow;
