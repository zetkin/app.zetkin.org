import { ArrowDropDown } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import { FunctionComponent, MouseEvent, ReactNode, useState } from 'react';
import Menu, { MenuProps } from '@mui/material/Menu';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{
      horizontal: 'right',
      vertical: 'bottom',
    }}
    transformOrigin={{
      horizontal: 'right',
      vertical: 'top',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1),
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
}));

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

  return (
    <div>
      <Button
        endIcon={<ArrowDropDown />}
        onClick={handleClick}
        variant="contained"
      >
        {text}
      </Button>
      <StyledMenu anchorEl={anchorEl} onClose={handleClose} open={open}>
        {children}
      </StyledMenu>
    </div>
  );
};

export default ZUIButtonMenu;
