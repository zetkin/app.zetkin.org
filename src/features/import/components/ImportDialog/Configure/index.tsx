import { CompareArrows } from '@mui/icons-material';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import ImportFooter from '../elements/ImportFooter';
import ImportHeader from '../elements/ImportHeader';
import { ImportStep } from '..';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import Preview from './Preview';
import SheetSettings from './SheetSettings';
import useConfigure from 'features/import/hooks/useConfigure';
import useImportConfigState from 'features/import/hooks/useUIDataColumns';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import ZUIEmptyState from 'zui/ZUIEmptyState';

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
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const { configIsIncomplete, numColumns, numRows } = useImportConfigState();
  const getPreflightStats = useConfigure(orgId);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          paddingY={4}
        >
          <CircularProgress sx={{ color: theme.palette.statusColors.blue }} />
          <Typography sx={{ color: theme.palette.text.primary }}>
            {messages.preflight.messages.validating()}
          </Typography>
        </Box>
      )}
      {!loading && (
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          overflow="hidden"
        >
          <ImportHeader activeStep={ImportStep.CONFIGURE} onClose={onClose} />
          <Box display="flex" flexGrow={1} overflow="hidden">
            <Box
              display="flex"
              flexDirection="column"
              sx={{ overflowY: 'auto' }}
              width="50%"
            >
              <SheetSettings
                clearConfiguration={() => setColumnIndexBeingConfigured(null)}
              />
              <Mapping
                clearConfiguration={() => setColumnIndexBeingConfigured(null)}
                columnIndexBeingConfigured={columnIndexBeingConfigured}
                numberOfColumns={numColumns}
                onConfigureStart={(columnIndex: number) =>
                  setColumnIndexBeingConfigured(columnIndex)
                }
              />
            </Box>
            <Box display="flex" flexDirection="column" width="50%">
              {columnIndexBeingConfigured !== null && (
                <Configuration
                  columnIndexBeingConfigured={columnIndexBeingConfigured}
                />
              )}
              {columnIndexBeingConfigured === null && (
                <Box
                  alignItems="center"
                  display="flex"
                  height="100%"
                  justifyContent="center"
                  sx={{ opacity: '50%' }}
                >
                  <ZUIEmptyState
                    message={messages.configuration.mapping.emptyStateMessage()}
                    renderIcon={(props) => <CompareArrows {...props} />}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Preview />
          <ImportFooter
            onClickPrimary={async () => {
              setLoading(true);
              if (getPreflightStats) {
                await getPreflightStats();
              }
              onValidate();
              setLoading(false);
            }}
            onClickSecondary={onRestart}
            primaryButtonDisabled={configIsIncomplete}
            primaryButtonMsg={messages.actionButtons.validate()}
            secondaryButtonMsg={messages.actionButtons.restart()}
            statusMessage={
              configIsIncomplete
                ? messages.configuration.statusMessage.notDone()
                : messages.configuration.statusMessage.done({
                    numConfiguredPeople: numRows,
                  })
            }
          />
        </Box>
      )}
    </>
  );
};

export default Configure;
