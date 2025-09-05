import { FC } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { BadgeOutlined } from '@mui/icons-material';

import { IDFieldColumn, ImportID } from 'features/import/utils/types';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import useIDConfig from 'features/import/hooks/useIDConfig';
import { Msg } from 'core/i18n';
import messageIds from 'features/import/l10n/messageIds';
import useSheets from 'features/import/hooks/useSheets';
import useImportID from 'features/import/hooks/useImportID';

interface IdConfigProps {
  uiDataColumn: UIDataColumn<IDFieldColumn>;
}

const IdConfig: FC<IdConfigProps> = ({ uiDataColumn }) => {
  const { wrongIDFormat } = useIDConfig(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );
  const { importID, updateImportID } = useImportID();
  const { skipUnknown, updateSheetSettings } = useSheets();
  const getIdLabel = (idField: ImportID) => {
    if (idField == 'id') {
      return 'Zetkin ID';
    } else if (idField == 'ext_id') {
      return 'External ID';
    } else if (idField == 'email') {
      return 'Email';
    } else {
      return '';
    }
  };

  if (uiDataColumn.originalColumn.idField == 'id' && importID !== 'id') {
    updateImportID('id');
  }

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
        {uiDataColumn.originalColumn.idField == 'email' && (
          <Typography variant="h5">Email</Typography>
        )}
        {uiDataColumn.originalColumn.idField == 'ext_id' && (
          <>
            <Typography variant="h5">
              <Msg id={messageIds.configuration.configure.ids.externalID} />
            </Typography>
            <Typography>
              <Msg id={messageIds.configuration.configure.ids.externalIDInfo} />
            </Typography>
          </>
        )}
        <Box mt={2}>
          <Box alignItems="center" display="flex" gap={1}>
            <Typography variant="h5">Import ID</Typography>
            <BadgeOutlined color="secondary" fontSize="small" />
          </Box>
          <Typography>
            {getIdLabel(uiDataColumn.originalColumn.idField) +
              ' can be used to find and idenfity people in Zetkin.'}
          </Typography>
        </Box>
        {importID && importID !== uiDataColumn.originalColumn.idField && (
          <Alert severity="error">
            {getIdLabel(importID) +
              ' is currently set as the Import ID. To choose a different Import ID, first deselect ' +
              getIdLabel(importID)}
          </Alert>
        )}
        <Box ml={2}>
          <Box display="flex" flexDirection="column" mb={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={importID == uiDataColumn.originalColumn.idField}
                  disabled={importID !== null ? true : false}
                  onChange={() =>
                    updateImportID(uiDataColumn.originalColumn.idField!)
                  }
                />
              }
              label={`Use ${getIdLabel(
                uiDataColumn.originalColumn.idField
              )} as Import ID`}
            />
            <Typography color="text.secondary" sx={{ ml: 4 }} variant="body2">
              The field will be used to find people that already exist in
              Zetkin, each row should ideally be unique
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <FormControlLabel
              control={
                <Checkbox
                  checked={skipUnknown}
                  onChange={(ev, isChecked) =>
                    updateSheetSettings({ skipUnknown: isChecked })
                  }
                />
              }
              label={<Msg id={messageIds.configuration.settings.skipUnknown} />}
            />
            <Typography color="text.secondary" sx={{ ml: 4 }} variant="body2">
              No new people will be created
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default IdConfig;
