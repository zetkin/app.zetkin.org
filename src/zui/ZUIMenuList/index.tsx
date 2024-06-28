import { makeStyles } from '@mui/styles';
import { FC, ReactNode } from 'react';
import { MenuList, Theme } from '@mui/material';

const useStyles = makeStyles<
  Theme,
  { disableGutters?: boolean; smallScreen?: boolean }
>({
  list: {
    '& li': {
      paddingBottom: ({ smallScreen }) => (smallScreen ? '16px' : ''),
      paddingLeft: ({ disableGutters }) => (disableGutters ? 0 : ''),
      paddingRight: ({ disableGutters }) => (disableGutters ? 0 : ''),
      paddingTop: ({ smallScreen }) => (smallScreen ? '16px' : ''),
    },
  },
});

interface ZUIMenuListProps {
  children: ReactNode;
  dense?: boolean;
  disableGutters?: boolean;
  smallScreen?: boolean;
}

const ZUIMenuList: FC<ZUIMenuListProps> = ({
  children,
  dense,
  disableGutters,
  smallScreen,
}) => {
  const classes = useStyles({ disableGutters, smallScreen });
  return (
    <MenuList className={classes.list} dense={dense}>
      {children}
    </MenuList>
  );
};

export default ZUIMenuList;
