import { Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { ClickAwayListener } from '@material-ui/core';

type BlockArrowIconProps = {
  blockIndex: number;
  blockIsOnEdit: boolean;
  blockLength: number;
};

const BlockArrowIcon = ({
  blockIndex,
  blockLength,
  blockIsOnEdit,
}: BlockArrowIconProps) => {
  // const handleArrow = (direction: string): undefined => {
  // console.log(direction);
  //   return;
  // };

  // const handleClick = () => {
  //   console.log('i'm out');
  // };
  // when you click the arrows, inEditMode should be true still.
  return (
    <>
      {blockIsOnEdit && (
        // <ClickAwayListener onClickAway={handleClick}>
        <Box display="flex" flexDirection="column">
          {blockIndex !== 0 && (
            // <Box onClick={() => handleArrow('up')}>
            <KeyboardArrowUpIcon sx={{ margin: '1em 1em 1em 0' }} />
            // </Box>
          )}
          {blockIndex !== blockLength && (
            // <Box onClick={() => handleArrow('down')}>
            <KeyboardArrowDownIcon sx={{ margin: '1em 1em 1em 0' }} />
            // </Box>
          )}
        </Box>
        // </ClickAwayListener>
      )}
    </>
  );
};

export default BlockArrowIcon;
