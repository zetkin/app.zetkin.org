import { Box, Dialog, useMediaQuery, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import Configure from './Steps/Configure';
import ParseFile from './Steps/ParseFile';
import Preflight from './Steps/Preflight';
import StatusReport from './Steps/StatusReport';

export enum ImportStep {
  PARSE = 0,
  CONFIGURE = 1,
  PREFLIGHT = 2,
  REPORT = 3,
}

interface ImportDialogProps {
  onClose: () => void;
  open: boolean;
}

const ImportDialog: FC<ImportDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [maxWidth, setMaxWidth] = useState<'sm' | 'lg'>('sm');
  const [activeStep, setActiveStep] = useState<ImportStep>(ImportStep.PARSE);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={maxWidth}
      onClose={() => {
        onClose();
        setActiveStep(ImportStep.PARSE);
      }}
      open={open}
    >
      <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
        {activeStep == ImportStep.PARSE && (
          <ParseFile
            onClose={onClose}
            onSuccess={() => {
              setActiveStep(ImportStep.CONFIGURE);
              setMaxWidth('lg');
            }}
          />
        )}
        {activeStep == ImportStep.CONFIGURE && (
          <Configure
            onClose={() => {
              onClose();
              setActiveStep(ImportStep.PARSE);
            }}
            onRestart={() => setActiveStep(ImportStep.PARSE)}
            onValidate={() => setActiveStep(ImportStep.PREFLIGHT)}
          />
        )}
        {activeStep === ImportStep.CONFIGURE && (
          <Preflight
            onClickBack={() => setActiveStep(ImportStep.CONFIGURE)}
            onClose={() => {
              onClose();
              setActiveStep(ImportStep.PARSE);
            }}
            onImportDone={() => setActiveStep(ImportStep.REPORT)}
            onImportStart={() => setMaxWidth('sm')}
          />
        )}
        {activeStep === ImportStep.REPORT && (
          <StatusReport
            onClickBack={() => setActiveStep(ImportStep.PREFLIGHT)}
            onClose={() => {
              onClose();
              setActiveStep(ImportStep.PARSE);
            }}
            onDone={() => {
              onClose();
              setActiveStep(ImportStep.PARSE);
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ImportDialog;
