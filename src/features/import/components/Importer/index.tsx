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

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      onClose={onClose}
      open={open}
    >
      <Box display="flex" flexDirection="column" height="90vh">
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          padding={2}
        >
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
              {activeStep < 3 && (
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
        <Configure
          sheets={[
            {
              data: [
                { data: ['Name', 'Last name', 'Email', 'Age'] },
                { data: ['Angela', 'Davies', 'angela@gmail.com', 34] },
                { data: ['Maya', 'Angelou', 'maya@gmail.com', 66] },
                { data: ['Rosa', 'Parks', 'rosa@gmail.com', 81] },
                { data: ['Huey', 'P Newton', 'huey@gmail.com', 51] },
              ],
              id: 1,
              title: 'Members',
            },
            {
              data: [
                { data: ['Name', 'Last name', 'Email', 'Age'] },
                { data: ['Kitty', 'Jonsson', 'kitty@gmail.com', 36] },
                { data: ['Lasse', 'Brandeby', 'lasse@gmail.com', 81] },
                { data: ['Pamela', 'Andersson', 'pamela@gmail.com', 61] },
                { data: ['Jane', 'Austen', 'jane@gmail.com', 102] },
              ],
              id: 2,
              title: 'Old Members',
            },
          ]}
        />
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
      </Box>
    </Dialog>
  );
};

export default Importer;
