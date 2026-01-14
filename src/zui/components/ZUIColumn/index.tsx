import { Box } from '@mui/material';
import { FC } from 'react';

import theme from 'zui/theme';

type columnSizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type Props = {
  children?: React.ReactNode;
  size?: columnSizes;
  sx?: object;
};

const ZUIColumn: FC<Props> = (props) => {
  const mergedSx = Object.assign(
    {
      display: 'flex',
      flexBasis: 'auto',
      flexDirection: 'column',
      flexGrow: props.size ? 0 : 1,
      gap: 2,
      maxWidth: '100%',
      minWidth: 0,
      ...(props.size
        ? {
            [theme.containerQueries.up('sm')]: {
              width: `calc(100% * ${props.size} / var(--parentColumns) - (var(--parentColumns) - ${props.size}) * var(--parentSpacing) / var(--parentColumns))`,
            },
          }
        : {}),
    },
    props.sx
  );
  return <Box {...{ sx: mergedSx }}>{props.children}</Box>;
};

export default ZUIColumn;
