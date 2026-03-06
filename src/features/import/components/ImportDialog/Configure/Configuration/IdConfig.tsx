import { FC, useContext, useEffect } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { BadgeOutlined } from '@mui/icons-material';

import { IDFieldColumn } from 'features/import/types';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import useIDConfig from 'features/import/hooks/useIDConfig';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/import/l10n/messageIds';
import useSheets from 'features/import/hooks/useSheets';
import useImportID from 'features/import/hooks/useImportID';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

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
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  useEffect(() => {
    if (skipUnknown) {
      updateSheetSettings({ skipUnknown: false });
    }
  }, [importID]);

  const idField = uiDataColumn.originalColumn.idField;

  const importIDHasBeenSelected = !!importID;
  const selectedImportIDIsOtherThanTheFieldBeingConfigured =
    importIDHasBeenSelected && importID != idField;

  return (
    <Box display="flex" flexDirection="column" padding={2}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5">
          <Msg id={messageIds.configuration.configure.ids.field[idField]} />
        </Typography>
        {idField == 'id' && (
          <>
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
        {idField == 'ext_id' && (
          <Typography>
            <Msg id={messageIds.configuration.configure.ids.externalIDInfo} />
          </Typography>
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
                importID: idField,
              }}
            />
          </Typography>
        </Box>
        <Box ml={2}>
          {idField != 'id' && (
            <Box display="flex" flexDirection="column" mb={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={importID == idField}
                    onChange={() => {
                      if (selectedImportIDIsOtherThanTheFieldBeingConfigured) {
                        showConfirmDialog({
                          onSubmit: () => updateImportID(idField),
                          title:
                            messages.configuration.configure.ids.confirmIDChange.title(),
                          warningText:
                            messages.configuration.configure.ids.confirmIDChange.description(
                              {
                                currentImportID:
                                  messages.configuration.configure.ids.field[
                                    importID
                                  ](),
                                newImportID:
                                  messages.configuration.configure.ids.field[
                                    idField
                                  ](),
                              }
                            ),
                        });
                      } else {
                        updateImportID(importID == idField ? null : idField);
                      }
                    }}
                  />
                }
                label={messages.configuration.configure.ids.importCheckboxLabel(
                  {
                    importID:
                      messages.configuration.configure.ids.field[idField](),
                  }
                )}
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
          )}
          {importID == idField && (
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
