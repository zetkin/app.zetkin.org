import { Box } from '@mui/material';
import { FC } from 'react';

import theme from 'zui/theme';

type Props = {
  children: React.ReactNode;
  /**
   * Column width based on a 12-column grid. Total width of all columns in one row should not exceed 12.
   * If size is null or not provided, the column will take up remaining space.
   * Columns will wexpand to full width on small screens.
   *
   * Example usages:
   * <ZUIColumn size={6}>...</ZUIColumn> - takes up half the width
   * <ZUIColumn size={4}>...</ZUIColumn> - takes up one third of the width
   * <ZUIColumn>...</ZUIColumn> - takes up remaining space
   */
  size?: null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
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
