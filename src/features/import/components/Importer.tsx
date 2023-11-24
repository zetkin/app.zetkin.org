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

import Configure from './Configure';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import Validation from './Validation';

interface ImporterProps {
  onClose: () => void;
  open: boolean;
}

type ImportSteps = 0 | 1 | 2 | 3;

const Importer: FC<ImporterProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState<ImportSteps>(1);
  const [disabled, setDisabled] = useState<boolean>(false);

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
        <Configure />
        {activeStep === 2 && (
          <Validation
            onClickBack={() => setActiveStep(0)}
            onDisabled={(value) => setDisabled(value)}
          />
        )}
        <Box alignItems="center" display="flex" justifyContent="flex-end">
          <Box
            alignItems="center"
            display="flex"
            justifyContent="flex-end"
            padding={2}
          >
            <Typography color="secondary">
              This message will depend on the state of the import.
            </Typography>
            <Button
              onClick={() => {
                setActiveStep(0);
              }}
              sx={{ mx: 1 }}
              variant="text"
            >
              <Msg id={activeStep > 1 ? messageIds.back : messageIds.restart} />
            </Button>
            <Button
              disabled={disabled}
              onClick={() => setActiveStep(1)}
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
      </Box>
    </Dialog>
  );
};

export default Importer;
