import { Clear } from '@mui/icons-material';
import { FC } from 'react';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';

interface ImporterProps {
  activeStep: 0 | 1 | 2 | 3;
  onClose: () => void;
  onRestart: () => void;
  onValidate: () => void;
  open: boolean;
}

const Importer: FC<ImporterProps> = ({
  activeStep,
  onRestart,
  onValidate,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      onClose={onClose}
      open={open}
    >
      <Box
        display="flex"
        flexDirection="column"
        height="90vh"
        justifyContent="space-between"
        padding={2}
      >
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Typography variant="h4">
            <Msg id={messageIds.configuration.title} />
          </Typography>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            width="50%"
          >
            <Box width="100%">
              <Stepper activeStep={activeStep}>
                <Step>
                  <StepLabel>
                    <Msg id={messageIds.steps.upload} />
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <Msg id={messageIds.steps.configure} />
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <Msg id={messageIds.steps.validate} />
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <Msg id={messageIds.steps.import} />
                  </StepLabel>
                </Step>
              </Stepper>
            </Box>
            <IconButton>
              <Clear color="secondary" onClick={onClose} />
            </IconButton>
          </Box>
        </Box>
        <Box alignItems="center" display="flex" justifyContent="flex-end">
          <Typography color="secondary">
            This message will depend on the state of the import.
          </Typography>
          <Button onClick={onRestart} sx={{ mx: 1 }} variant="text">
            <Msg id={messageIds.restart} />
          </Button>
          <Button
            disabled={true}
            onClick={onValidate}
            sx={{ ml: 1 }}
            variant="contained"
          >
            Validate
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Importer;
