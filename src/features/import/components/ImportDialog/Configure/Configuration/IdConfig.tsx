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
import useIDConfig from 'features/import/hooks/useIDConfig';
import useIdColumns from 'features/import/hooks/useIdColumns';

interface IdConfigProps {
  uiDataColumn: UIDataColumn<IDFieldColumn>;
}

const IdConfig: FC<IdConfigProps> = ({ uiDataColumn }) => {
  const theme = useTheme();
  const { updateIDField, wrongIDFormat } = useIDConfig(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );
  const idColumns = useIdColumns();

  const canChooseZId =
    idColumns.filter(
      (col, index) => index !== uiDataColumn.columnIndex && col.idField === 'id'
    ).length === 0;
  const canChooseExtId =
    idColumns.filter(
      (col, index) =>
        index !== uiDataColumn.columnIndex && col.idField === 'ext_id'
    ).length === 0;

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
              disabled={!canChooseExtId}
              onChange={(event) => {
                if (
                  event.target.value == 'ext_id' ||
                  event.target.value == 'id'
                ) {
                  updateIDField(event.target.value);
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
              disabled={!canChooseZId}
              onChange={(event) => {
                if (
                  event.target.value == 'ext_id' ||
                  (event.target.value == 'id' && !wrongIDFormat)
                ) {
                  updateIDField(event.target.value);
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
      {wrongIDFormat && (
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
