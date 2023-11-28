import { Clear } from '@mui/icons-material';
import {
  Box,
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

import Configure from './Configure';
import ImportStatus from './ImportStatus';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import Upload from './Upload';
import Validation from './Validation';

interface ImporterProps {
  onClose: () => void;
  open: boolean;
}

type ImportSteps = 0 | 1 | 2 | 3;

const Importer: FC<ImporterProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState<ImportSteps>(2);
  const [loading] = useState<boolean>(false);
  const showStepper = activeStep == 1 || activeStep == 2;

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
            <IconButton
              onClick={() => {
                onClose();
                setActiveStep(0);
              }}
            >
              <Clear color="secondary" />
            </IconButton>
          </Box>
        </Box>
        {activeStep == 0 && <Upload onSuccess={() => setActiveStep(1)} />}
        {activeStep == 1 && (
          <Configure
            onRestart={() => setActiveStep(0)}
            onValidate={() => setActiveStep(2)}
          />
        )}
        {activeStep === 2 && (
          <Validation
            onClickBack={() => setActiveStep(1)}
            onImport={() => setActiveStep(3)}
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
    </Dialog>
  );
};

export default Importer;
