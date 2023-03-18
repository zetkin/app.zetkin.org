import { alpha } from '@mui/material/styles';
import { ArrowDropDown } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import theme from 'theme';
import {
  Children,
  cloneElement,
  FunctionComponent,
  isValidElement,
  MouseEvent,
  ReactNode,
  useState,
} from 'react';

const ZUIButtonMenu: FunctionComponent<{
  children: ReactNode;
  text: string;
}> = ({ text, children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChildClick = (childOnClick: () => void) => () => {
    handleClose();
    if (childOnClick) {
      childOnClick();
    }
  };

  const modifiedChildren = Children.map(children, (child) => {
    if (!isValidElement(child) || !('onClick' in child.props)) {
      return child;
    }

    return cloneElement(child, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onClick: handleChildClick(child.props.onClick as () => void),
    });
  });

  return (
    <div>
      <Button
        endIcon={<ArrowDropDown />}
        onClick={handleClick}
        variant="contained"
      >
        {text}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={handleClose}
        open={open}
        sx={{
          '& .MuiPaper-root': {
            '& .MuiMenuItem-root': {
              '& .MuiSvgIcon-root': {
                marginRight: 1,
              },
              '&:active': {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity
                ),
              },
            },
            marginTop: theme.spacing(1),
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        {modifiedChildren}
      </Menu>
    </div>
  );
};

export default ZUIButtonMenu;
