import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ImportFooterProps {
  backButtonMsg: string;
  forwardButtonDisabled: boolean;
  forwardButtonMsg: string;
  statusMessage?: string;
  onClickForward: () => void;
  onClickBack: () => void;
}

const ImportFooter: FC<ImportFooterProps> = ({
  backButtonMsg,
  forwardButtonDisabled,
  forwardButtonMsg,
  statusMessage,
  onClickBack,
  onClickForward,
}) => {
  return (
    <Box alignItems="center" display="flex" justifyContent="flex-end">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-end"
        padding={2}
      >
        {statusMessage && (
          <Typography color="secondary">{statusMessage}</Typography>
        )}
        <Button onClick={onClickBack} sx={{ mx: 1 }} variant="text">
          {backButtonMsg}
        </Button>
        <Button
          disabled={forwardButtonDisabled}
          onClick={onClickForward}
          sx={{ ml: 1 }}
          variant="contained"
        >
          {forwardButtonMsg}
        </Button>
      </Box>
    </Box>
  );
};

export default ImportFooter;
