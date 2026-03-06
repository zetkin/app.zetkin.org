import { Box, Dialog, useMediaQuery, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import Configure from './Configure';
import ParseFile from './ParseFile';
import Preflight from './Preflight';
import StatusReport from './StatusReport';
import useImportID from 'features/import/hooks/useImportID';

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
  const { updateImportID } = useImportID();
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
        setMaxWidth('sm');
        updateImportID(null);
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
              setMaxWidth('sm');
              updateImportID(null);
            }}
            onRestart={() => {
              setActiveStep(ImportStep.PARSE);
              setMaxWidth('sm');
              updateImportID(null);
            }}
            onValidate={() => setActiveStep(ImportStep.PREFLIGHT)}
          />
        )}
        {activeStep === ImportStep.PREFLIGHT && (
          <Preflight
            onClickBack={() => setActiveStep(ImportStep.CONFIGURE)}
            onClose={() => {
              onClose();
              setActiveStep(ImportStep.PARSE);
              setMaxWidth('sm');
              updateImportID(null);
            }}
            onImportDone={() => setActiveStep(ImportStep.REPORT)}
            onImportStart={() => setMaxWidth('sm')}
          />
        )}
        {activeStep === ImportStep.REPORT && (
          <StatusReport
            onClickBack={() => {
              setActiveStep(ImportStep.PREFLIGHT);
              setMaxWidth('lg');
            }}
            onClose={() => {
              onClose();
              setActiveStep(ImportStep.PARSE);
              updateImportID(null);
            }}
            onDone={() => {
              onClose();
              setActiveStep(ImportStep.PARSE);
              updateImportID(null);
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ImportDialog;
