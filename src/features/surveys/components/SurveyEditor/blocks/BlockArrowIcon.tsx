import { Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
  return (
    <>
      {blockIsOnEdit && (
        <Box display="flex" flexDirection="column">
          {blockIndex !== 0 && (
            <KeyboardArrowUpIcon sx={{ margin: '1em 1em 1em 0' }} />
          )}
          {blockIndex !== blockLength && (
            <KeyboardArrowDownIcon sx={{ margin: '1em 1em 1em 0' }} />
          )}
        </Box>
      )}
    </>
  );
};

export default BlockArrowIcon;
