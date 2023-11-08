import { Clear } from '@mui/icons-material';
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
import { FC, useState } from 'react';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';

interface ImporterProps {
  onClose: () => void;
  onRestart: () => void;
  open: boolean;
}

type StepType = 0 | 1 | 2 | 3;

const Importer: FC<ImporterProps> = ({ onRestart, open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState<StepType>(1);

  const showStepper = activeStep == 1 || activeStep == 2;

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={activeStep == 0 ? false : true}
      maxWidth="lg"
      onClose={onClose}
      open={open}
    >
      <Box
        display="flex"
        flexDirection="column"
        height={activeStep == 0 ? '' : '90vh'}
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
              {showStepper && (
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
              )}
            </Box>
            <IconButton>
              <Clear color="secondary" onClick={onClose} />
            </IconButton>
          </Box>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="flex-end"
          sx={{ bottom: 15, position: 'absolute', right: 15 }}
        >
          <Typography color="secondary">
            This message will depend on the state of the import.
          </Typography>
          <Button
            onClick={() => {
              activeStep > 1
                ? setActiveStep((prev) => (prev - 1) as StepType)
                : onRestart();
            }}
            sx={{ mx: 1 }}
            variant="text"
          >
            <Msg id={activeStep > 1 ? messageIds.back : messageIds.restart} />
          </Button>
          <Button
            disabled={false}
            onClick={() => {
              if (activeStep === 3) {
                onClose();
                setActiveStep(1);
              } else {
                setActiveStep((prev) => (prev + 1) as StepType);
              }
            }}
            sx={{ ml: 1 }}
            variant="contained"
          >
            <Msg
              id={
                activeStep === 1
                  ? messageIds.validate
                  : activeStep === 2
                  ? messageIds.import
                  : messageIds.done
              }
            />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Importer;
