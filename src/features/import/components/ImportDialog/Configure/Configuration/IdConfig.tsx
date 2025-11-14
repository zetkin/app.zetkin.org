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
import { Msg, useMessages } from 'core/i18n';
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
  const messages = useMessages(messageIds);
  const getIdLabel = (idField: ImportID | null) => {
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
          <>
            <Typography variant="h5">
              <Msg id={messageIds.configuration.configure.ids.email} />
            </Typography>
            {wrongIDFormat && (
              <Alert severity="error">
                <Msg
                  id={
                    messageIds.configuration.configure.ids
                      .wrongEmailFormatWarning
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
            </Typography>
          </>
        )}
        <Box mt={2}>
          <Box alignItems="center" display="flex" gap={1}>
            <Typography variant="h5">
              <Msg id={messageIds.configuration.configure.ids.importID} />
            </Typography>
            <BadgeOutlined color="secondary" fontSize="small" />
          </Box>
          <Typography>
            <Msg
              id={messageIds.configuration.configure.ids.importIDDescription}
              values={{
                importID: getIdLabel(uiDataColumn.originalColumn.idField),
              }}
            />
          </Typography>
        </Box>
        <Box ml={2}>
          <Box display="flex" flexDirection="column" mb={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={importID == uiDataColumn.originalColumn.idField}
                  onChange={() => {
                    if (importID == uiDataColumn.originalColumn.idField) {
                      updateImportID(null);
                    } else {
                      updateImportID(uiDataColumn.originalColumn.idField!);
                    }
                  }}
                />
              }
              label={messages.configuration.configure.ids.importCheckboxLabel({
                importID: getIdLabel(uiDataColumn.originalColumn.idField),
              })}
            />
            <Typography color="text.secondary" sx={{ ml: 4 }} variant="body2">
              <Msg
                id={
                  messageIds.configuration.configure.ids
                    .importCheckboxDescription
                }
              />
            </Typography>
          </Box>
          {importID == uiDataColumn.originalColumn.idField && (
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
                label={
                  <Msg id={messageIds.configuration.settings.skipUnknown} />
                }
              />
              <Typography color="text.secondary" sx={{ ml: 4 }} variant="body2">
                <Msg
                  id={messageIds.configuration.configure.ids.skipRowDescription}
                />
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default IdConfig;
