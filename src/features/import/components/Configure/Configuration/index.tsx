import { CompareArrows } from '@mui/icons-material';
import { FC } from 'react';
import { Box, useTheme } from '@mui/material';

import IdConfig from './IdConfig';
import messageIds from 'features/import/l10n/messageIds';
import TagConfig from './TagConfig';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumns';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import {
  ColumnKind,
  IDFieldColumn,
  TagColumn,
} from 'features/import/utils/types';

interface ConfigurationProps {
  uiDataColumn: UIDataColumn | null;
}

const Configuration: FC<ConfigurationProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.transparentGrey.light}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      {uiDataColumn && uiDataColumn.originalColumn.kind == ColumnKind.TAG && (
        <TagConfig
          uiDataColumn={
            uiDataColumn as UIDataColumn & { originalColumn: TagColumn }
          }
        />
      )}
      {uiDataColumn &&
        uiDataColumn.originalColumn.kind == ColumnKind.ID_FIELD && (
          <IdConfig
            uiDataColumn={
              uiDataColumn as UIDataColumn & { originalColumn: IDFieldColumn }
            }
          />
        )}
      {!uiDataColumn && (
        <Box alignItems="center" display="flex" justifyContent="center">
          <ZUIEmptyState
            message={messages.configuration.mapping.emptyStateMessage()}
            renderIcon={(props) => <CompareArrows {...props} />}
          />
        </Box>
      )}
    </Box>
  );
};

export default Configuration;
