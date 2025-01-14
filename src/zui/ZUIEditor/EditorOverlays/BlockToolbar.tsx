import { Box, Button, Paper } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

type BlockToolbarProps = {
  curBlockType: string;
  curBlockY: number;
  pos: number;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  curBlockType,
  curBlockY,
  pos,
}) => {
  const { convertParagraph, focus, toggleHeading, pickImage, setLink } =
    useCommands();

  return (
    <Box position="relative">
      <Box
        sx={{
          left: 0,
          position: 'absolute',
          top: curBlockY - 50,
          transition: 'opacity 0.5s',
          zIndex: 10000,
        }}
      >
        <Paper elevation={1}>
          <Box alignItems="center" display="flex" padding={1}>
            {curBlockType}
            {curBlockType == 'zimage' && (
              <Button
                onClick={() => {
                  pickImage(pos);
                }}
              >
                Change image
              </Button>
            )}
            {curBlockType == 'heading' && (
              <Button onClick={() => convertParagraph()}>
                Convert to paragraph
              </Button>
            )}
            {curBlockType == 'paragraph' && (
              <>
                <Button onClick={() => toggleHeading()}>
                  Convert to heading
                </Button>
                <Button
                  onClick={() => {
                    setLink();
                    focus();
                  }}
                >
                  Link
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
