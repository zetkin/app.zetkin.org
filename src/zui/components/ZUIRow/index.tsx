import { Stack } from '@mui/material';
import { FC, ReactElement } from 'react';

import ZUIColumn from '../ZUIColumn';
import theme from 'zui/theme';

type Props = {
  children?: ReactElement<typeof ZUIColumn> | ReactElement<typeof ZUIColumn>[];
  sx?: object;
};

const ZUIRow: FC<Props> = (props) => {
  const mergedSx = Object.assign(
    {
      '--parentColumns': 12,
      '--parentSpacing': theme.spacing(2),
      alignItems: 'flex-start',
      containerType: 'inline-size',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 'var(--parentSpacing)',
    },
    props.sx
  );
  return (
    <Stack direction="row" useFlexGap {...{ sx: mergedSx }}>
      {props.children}
    </Stack>
  );
};

export default ZUIRow;
