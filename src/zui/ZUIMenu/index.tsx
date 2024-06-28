import { makeStyles } from '@mui/styles';
import { FC, ReactNode } from 'react';
import { Menu, Theme } from '@mui/material';

const useStyles = makeStyles<Theme, { maxHeight?: string; width?: string }>({
  menu: {
    '& ul': {
      maxHeight: ({ maxHeight }) => (maxHeight ? maxHeight : ''),
      width: ({ width }) => (width ? width : ''),
    },
  },
});

interface ZUIMenuProps {
  anchorEl?: Element | null;
  children: ReactNode;
  maxHeight?: string;
  width?: string;
  onClose?: () => void;
}

const ZUIMenu: FC<ZUIMenuProps> = ({
  anchorEl,
  children,
  maxHeight,
  width,
  onClose,
}) => {
  const classes = useStyles({ maxHeight, width });
  return (
    <Menu
      anchorEl={anchorEl}
      className={classes.menu}
      onClose={onClose}
      open={!!anchorEl}
    >
      {children}
    </Menu>
  );
};

export default ZUIMenu;
