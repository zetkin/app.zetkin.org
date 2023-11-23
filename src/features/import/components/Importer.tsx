import { Clear } from '@mui/icons-material';
import {
  Box,
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
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import Upload from './Upload';

interface ImporterProps {
  onClose: () => void;
  open: boolean;
}

type StepType = 0 | 1 | 2 | 3;

const Importer: FC<ImporterProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState<StepType>(0);

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
              <Clear
                color="secondary"
                onClick={() => {
                  onClose();
                  setActiveStep(1);
                }}
              />
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
      </Box>
    </Dialog>
  );
};

export default Importer;
