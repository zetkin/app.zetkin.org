import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import ImportFooter from '../../ImportFooter';
import ImportHeader from '../../ImportHeader';
import { ImportStep } from '../..';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import SheetSettings from './SheetSettings';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import usePreflight from 'features/import/hooks/usePreflight';
import useUIDataColumns from 'features/import/hooks/useUIDataColumns';

interface ConfigureProps {
  onClose: () => void;
  onRestart: () => void;
  onValidate: () => void;
}

const Configure: FC<ConfigureProps> = ({ onClose, onRestart, onValidate }) => {
  const messages = useMessages(messageIds);
  const [columnIndexBeingConfigured, setColumnIndexBeingConfigured] = useState<
    number | null
  >(null);
  const { orgId } = useNumericRouteParams();
  const { forwardMessageDisabled, numRows, uiDataColumns } =
    useUIDataColumns(orgId);
  const preflight = usePreflight(orgId);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <ImportHeader activeStep={ImportStep.CONFIGURE} onClose={onClose} />
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box
          display="flex"
          flexDirection="column"
          sx={{ overflowY: 'scroll' }}
          width="50%"
        >
          <SheetSettings
            clearConfiguration={() => setColumnIndexBeingConfigured(null)}
          />
          <Mapping
            clearConfiguration={() => setColumnIndexBeingConfigured(null)}
            columnIndexBeingConfigured={columnIndexBeingConfigured}
            columns={uiDataColumns}
            onConfigureStart={(columnIndex: number) =>
              setColumnIndexBeingConfigured(columnIndex)
            }
          />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <Configuration
            uiDataColumn={
              typeof columnIndexBeingConfigured == 'number'
                ? uiDataColumns[columnIndexBeingConfigured]
                : null
            }
          />
        </Box>
      </Box>
      <Box padding={4}>Preview</Box>
      <ImportFooter
        onClickPrimary={async () => {
          if (preflight) {
            await preflight();
          }
          onValidate();
        }}
        onClickSecondary={onRestart}
        primaryButtonDisabled={forwardMessageDisabled}
        primaryButtonMsg={messages.actionButtons.validate()}
        secondaryButtonMsg={messages.actionButtons.restart()}
        statusMessage={
          forwardMessageDisabled
            ? messages.configuration.statusMessage.notDone()
            : messages.configuration.statusMessage.done({
                numConfiguredPeople: numRows,
              })
        }
      />
    </Box>
  );
};

export default Configure;
