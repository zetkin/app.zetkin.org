import { FC } from 'react';
import { Box, useTheme } from '@mui/material';

import IdConfig from './IdConfig';
import OrgConfig from './OrgConfig';
import TagConfig from './TagConfig';
import {
  ColumnKind,
  IDFieldColumn,
  OrgColumn,
  TagColumn,
} from 'features/import/utils/types';
import useUIDataColumn, {
  UIDataColumn,
} from 'features/import/hooks/useUIDataColumn';

interface ConfigurationProps {
  columnIndexBeingConfigured: number;
}

const Configuration: FC<ConfigurationProps> = ({
  columnIndexBeingConfigured,
}) => {
  const theme = useTheme();
  const uiDataColumn = useUIDataColumn(columnIndexBeingConfigured);

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
    </Box>
  );
};

export default Configuration;
