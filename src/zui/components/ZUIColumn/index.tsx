import { Box } from '@mui/material';
import { FC } from 'react';
import theme from 'zui/theme';

type Props = {
  children?: React.ReactNode;
  sx?: object;
  size?: number;
};

const ZUIColumn: FC<Props> = (props) => {
  const mergedSx = Object.assign(
    {
      display: 'flex',
      flexBasis: 'auto',
      flexDirection: 'column',
      flexGrow: props.size ? 0 : 1,
      gap: 2,
      minWidth: 0,
      maxWidth: '100%',
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
