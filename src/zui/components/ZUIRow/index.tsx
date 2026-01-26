import { Stack } from '@mui/material';
import { FC, ReactElement } from 'react';

import ZUIColumn from '../ZUIColumn';

type Props = {
  children?: ReactElement<typeof ZUIColumn> | ReactElement<typeof ZUIColumn>[];
  sx?: object;
};

const ZUIRow: FC<Props> = ({ children, sx }) => (
  <Stack
    direction="row"
    sx={[
      (theme) => ({
      '--parentColumns': 12,
      '--parentSpacing': theme.spacing(2),
      alignItems: 'flex-start',
      containerType: 'inline-size',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 'var(--parentSpacing)',
      }),
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    useFlexGap
  >
    {children}
    </Stack>
  );

export default ZUIRow;
