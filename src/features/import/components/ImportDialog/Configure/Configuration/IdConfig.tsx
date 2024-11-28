import { FC } from 'react';
import { Alert, Box, Typography } from '@mui/material';

import { IDFieldColumn } from 'features/import/utils/types';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import useIDConfig from 'features/import/hooks/useIDConfig';
import { Msg } from 'core/i18n';
import messageIds from 'features/import/l10n/messageIds';

interface IdConfigProps {
  uiDataColumn: UIDataColumn<IDFieldColumn>;
}

const IdConfig: FC<IdConfigProps> = ({ uiDataColumn }) => {
  const { wrongIDFormat } = useIDConfig(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );

  return (
    <Box display="flex" flexDirection="column" padding={2}>
      <Box display="flex" flexDirection="column" gap={1}>
        {uiDataColumn.originalColumn.idField == 'id' && (
          <>
            <Typography variant="h5">
              <Msg id={messageIds.configuration.configure.ids.zetkinID} />
            </Typography>
            <Typography>
              <Msg id={messageIds.configuration.configure.ids.zetkinIDInfo} />
            </Typography>
            {wrongIDFormat && (
              <Alert severity="error">
                <Msg
                  id={
                    messageIds.configuration.configure.ids.wrongIDFormatWarning
                  }
                />
              </Alert>
            )}
          </>
        )}
        {uiDataColumn.originalColumn.idField == 'ext_id' && (
          <>
            <Typography variant="h5">
              <Msg id={messageIds.configuration.configure.ids.externalID} />
            </Typography>
            <Typography>
              <Msg id={messageIds.configuration.configure.ids.externalIDInfo} />
            </Typography>{' '}
          </>
        )}
      </Box>
    </Box>
  );
};

export default IdConfig;
