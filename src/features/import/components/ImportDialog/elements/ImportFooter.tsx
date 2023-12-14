import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface ImportFooterProps {
  secondaryButtonMsg?: string;
  primaryButtonDisabled: boolean;
  primaryButtonMsg: string;
  statusMessage?: string;
  onClickPrimary?: () => void;
  onClickSecondary?: () => void;
}

const ImportFooter: FC<ImportFooterProps> = ({
  secondaryButtonMsg,
  primaryButtonDisabled,
  primaryButtonMsg,
  statusMessage,
  onClickSecondary,
  onClickPrimary,
}) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="flex-end"
      paddingTop={1}
    >
      <Box alignItems="center" display="flex" justifyContent="flex-end">
        {statusMessage && (
          <Typography color="secondary">{statusMessage}</Typography>
        )}
        <Button onClick={onClickSecondary} sx={{ mx: 1 }} variant="text">
          {secondaryButtonMsg}
        </Button>
        <Button
          disabled={primaryButtonDisabled}
          onClick={onClickPrimary}
          sx={{ ml: 1 }}
          variant="contained"
        >
          {primaryButtonMsg}
        </Button>
      </Box>
    </Box>
  );
};

export default ImportFooter;
