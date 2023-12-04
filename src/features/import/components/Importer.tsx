import { Box, Dialog, useMediaQuery, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import Configure from './Configure';
import ImportStatus from './ImportStatus';
import { ImportStep } from './ImportHeader';
import Upload from './Upload';
import useImportPreview from '../hooks/useImportPreview';
import { useNumericRouteParams } from 'core/hooks';
import Validation from './Validation';

interface ImporterProps {
  onClose: () => void;
  open: boolean;
}

const Importer: FC<ImporterProps> = ({ open, onClose }) => {
  const { orgId } = useNumericRouteParams();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [maxWidth, setMaxWidth] = useState<'sm' | 'lg'>('sm');
  const [activeStep, setActiveStep] = useState<ImportStep>(0);

  const importPreview = useImportPreview(orgId);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={maxWidth}
      onClose={() => {
        onClose();
        setActiveStep(0);
      }}
      open={open}
    >
      <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
        {activeStep == 0 && (
          <Upload
            onClose={onClose}
            onSuccess={() => {
              setActiveStep(1);
              setMaxWidth('lg');
            }}
          />
        )}
        {activeStep == 1 && (
          <Configure
            onClose={() => {
              onClose();
              setActiveStep(0);
            }}
            onRestart={() => setActiveStep(0)}
            onValidate={async () => {
              if (importPreview) {
                await importPreview();
              }
              setActiveStep(2);
            }}
          />
        )}
        {activeStep === 2 && (
          <Validation
            onClickBack={() => setActiveStep(1)}
            onClose={() => {
              onClose();
              setActiveStep(0);
            }}
            onImportDone={() => setActiveStep(3)}
            onImportStart={() => setMaxWidth('sm')}
          />
        )}
        {activeStep === 3 && (
          <ImportStatus
            onClickBack={() => setActiveStep(2)}
            onClose={() => {
              onClose();
              setActiveStep(0);
            }}
            onDone={() => {
              onClose();
              setActiveStep(0);
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default Importer;
