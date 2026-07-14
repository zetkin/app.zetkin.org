import { Stack } from '@mui/material';
import { FC } from 'react';

type Props = {
  children: React.ReactNode;
  /**
   * Column width based on a 12-column grid. Total width of all columns in one row should not exceed 12 for proper layout.
   * If size is null or not provided, the column will take up remaining space.
   * Columns will wexpand to full width on small screens.
   *
   * @example:
   * <ZUIRow> - A row with the default 12-column layout
   *   <ZUIColumn size={6}>...</ZUIColumn> - takes up half the width
   *   <ZUIColumn size={4}>...</ZUIColumn> - takes up one third of the width
   *   <ZUIColumn>...</ZUIColumn> - takes up remaining space
   * </ZUIRow>
   */
  size?: null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

const ZUIColumn: FC<Props> = ({ children, size }) => (
  <Stack
    sx={[
      {
        flexBasis: 'auto',
        flexGrow: size ? 0 : 1,
        gap: 2,
        maxWidth: '100%',
        minWidth: 0,
        width: '100%',
      },
      (theme) =>
        size
          ? {
              [theme.containerQueries.up('sm')]: {
                width: `calc(100% * ${size} / var(--parentColumns) - (var(--parentColumns) - ${size}) * var(--parentSpacing) / var(--parentColumns))`,
              },
            }
          : {},
    ]}
    useFlexGap
  >
    {children}
  </Stack>
);

export default ZUIColumn;
