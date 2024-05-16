import { FC } from 'react';
import {
  Alert,
  Box,
  Divider,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material';

import { IDFieldColumn } from 'features/import/utils/types';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import useUpdateIdField from 'features/import/hooks/useUpdateIdField';

interface IdConfigProps {
  uiDataColumn: UIDataColumn<IDFieldColumn>;
}

const IdConfig: FC<IdConfigProps> = ({ uiDataColumn }) => {
  const theme = useTheme();
  const updateIdField = useUpdateIdField(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );

  return (
    <Box display="flex" flexDirection="column" padding={2}>
      <Typography sx={{ paddingBottom: 2 }} variant="h5">
        <Msg id={messageIds.configuration.configure.ids.header} />
      </Typography>
      <Typography sx={{ paddingBottom: 1 }}>
        <Msg id={messageIds.configuration.configure.ids.configExplanation} />
      </Typography>
      <RadioGroup
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          justifyContent: 'space-between',
          paddingBottom: 1,
        }}
      >
        <Box
          bgcolor="white"
          border={1}
          borderColor={theme.palette.divider}
          borderRadius={2}
          flex={1}
        >
          <Box alignItems="center" display="flex" padding={1}>
            <Radio
              checked={uiDataColumn.originalColumn.idField == 'ext_id'}
              onChange={(event) => {
                if (
                  event.target.value == 'ext_id' ||
                  event.target.value == 'id'
                ) {
                  updateIdField(event.target.value);
                }
              }}
              sx={{ paddingRight: 1 }}
              value="ext_id"
            />
            <Typography>
              <Msg id={messageIds.configuration.configure.ids.externalID} />
            </Typography>
          </Box>
          <Divider />
          <Box padding={1}>
            <Typography>
              <Msg
                id={
                  messageIds.configuration.configure.ids.externalIDExplanation
                }
              />
            </Typography>
          </Box>
        </Box>
        <Box
          bgcolor="white"
          border={1}
          borderColor={theme.palette.divider}
          borderRadius={2}
          flex={1}
        >
          <Box alignItems="center" display="flex" padding={1}>
            <Radio
              checked={uiDataColumn.originalColumn.idField == 'id'}
              onChange={(event) => {
                if (
                  event.target.value == 'ext_id' ||
                  (event.target.value == 'id' && !uiDataColumn.wrongIDFormat)
                ) {
                  updateIdField(event.target.value);
                }
              }}
              sx={{ paddingRight: 1 }}
              value="id"
            />
            <Typography>
              <Msg id={messageIds.configuration.configure.ids.zetkinID} />
            </Typography>
          </Box>
          <Divider />
          <Box padding={1}>
            <Typography>
              <Msg
                id={messageIds.configuration.configure.ids.zetkinIDExplanation}
              />
            </Typography>
          </Box>
        </Box>
      </RadioGroup>
      {uiDataColumn.wrongIDFormat && (
        <Alert severity="error">
          <Msg
            id={messageIds.configuration.configure.ids.wrongIDFormatWarning}
          />
        </Alert>
      )}
    </Box>
  );
};

export default IdConfig;
