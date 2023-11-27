import { Clear } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
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

import ImportStatus from './ImportStatus';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import Validation from './Validation';

interface ImporterProps {
  onClose: () => void;
  onRestart: () => void;
  open: boolean;
}

type ImportSteps = 0 | 1 | 2 | 3;

const Importer: FC<ImporterProps> = ({ onRestart, open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState<ImportSteps>(1);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [loading] = useState<boolean>(false);
  const showStepper = activeStep == 1 || activeStep == 2;

  //TODO: use real data from API response
  const statusError = false;

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={activeStep !== 3}
      maxWidth="lg"
      onClose={onClose}
      open={open}
    >
      <Box
        display="flex"
        flexDirection="column"
        padding={2}
        width={activeStep !== 3 ? '100%' : '700px'}
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
        <Box sx={{ height: activeStep === 2 ? '80%' : '85%' }}>
          {activeStep === 2 && (
            <Validation
              onClickBack={() => setActiveStep(0)}
              onDisabled={(value) => setDisabled(value)}
            />
          )}
          {activeStep === 3 && (
            <>
              {loading ? (
                <Box
                  alignItems="center"
                  display="flex"
                  height="80%"
                  justifyContent="center"
                >
                  <CircularProgress />
                </Box>
              ) : (
                <ImportStatus
                  onClickBack={() =>
                    setActiveStep((prev) => (prev - 1) as ImportSteps)
                  }
                />
              )}
            </>
          )}
        </Box>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="flex-end"
          sx={{ bottom: 15, right: 15 }}
        >
          <Typography color="secondary">
            This message will depend on the state of the import.
          </Typography>
          <Button
            onClick={() => {
              if (activeStep > 1) {
                setActiveStep((prev) => (prev - 1) as ImportSteps);
                setDisabled(false);
              } else {
                onRestart();
              }
            }}
            sx={{ mx: 1 }}
            variant="text"
          >
            <Msg id={activeStep > 1 ? messageIds.back : messageIds.restart} />
          </Button>
          <Button
            disabled={disabled}
            onClick={() => {
              if (activeStep === 3) {
                onClose();
                setActiveStep(1);
              } else {
                setActiveStep((prev) => (prev + 1) as ImportSteps);
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
                  : statusError
                  ? messageIds.close
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
