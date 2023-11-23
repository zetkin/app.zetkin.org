import { Box } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import ImportFooter from '../ImportFooter';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import SheetSettings from './SheetSettings';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useUIDataColumns from 'features/import/hooks/useUIDataColumns';

interface ConfigureProps {
  onRestart: () => void;
  onValidate: () => void;
}

const Configure: FC<ConfigureProps> = ({ onRestart, onValidate }) => {
  const messages = useMessages(messageIds);
  const [columnIndexBeingConfigured, setColumnIndexBeingConfigured] = useState<
    number | null
  >(null);
  const { orgId } = useNumericRouteParams();
  const { forwardMessageDisabled, numRows, uiDataColumns } =
    useUIDataColumns(orgId);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
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
        onClickPrimary={onValidate}
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
