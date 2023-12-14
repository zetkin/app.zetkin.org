import { CompareArrows } from '@mui/icons-material';
import { FC } from 'react';
import { Box, useTheme } from '@mui/material';

import IdConfig from './IdConfig';
import messageIds from 'features/import/l10n/messageIds';
import OrgConfig from './OrgConfig';
import TagConfig from './TagConfig';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumns';
import { useMessages } from 'core/i18n';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import {
  Column,
  ColumnKind,
  IDFieldColumn,
  OrgColumn,
  TagColumn,
} from 'features/import/utils/types';

interface ConfigurationProps {
  uiDataColumn: UIDataColumn<Column> | null;
}

const Configuration: FC<ConfigurationProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.transparentGrey.light}
      borderRadius={1}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      {uiDataColumn && uiDataColumn.originalColumn.kind == ColumnKind.TAG && (
        <TagConfig uiDataColumn={uiDataColumn as UIDataColumn<TagColumn>} />
      )}
      {uiDataColumn &&
        uiDataColumn.originalColumn.kind == ColumnKind.ID_FIELD && (
          <IdConfig
            uiDataColumn={uiDataColumn as UIDataColumn<IDFieldColumn>}
          />
        )}
      {uiDataColumn &&
        uiDataColumn.originalColumn.kind == ColumnKind.ORGANIZATION && (
          <OrgConfig uiDataColumn={uiDataColumn as UIDataColumn<OrgColumn>} />
        )}
      {!uiDataColumn && (
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
  );
};

export default Configuration;
