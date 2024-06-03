import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

import EditPersonFields from './EditPersonFields';
import messageIds from '../../l10n/messageIds';
import { Msg } from 'core/i18n';
import useEditPerson from 'features/profile/hooks/useEditPerson';
import usePersonMutations from 'features/profile/hooks/usePersonMutations';
import { ZetkinPerson } from 'utils/types/zetkin';

interface EditPersonDialogProps {
  onClose: () => void;
  open: boolean;
  orgId: number;
  person: ZetkinPerson;
}

const EditPersonDialog: FC<EditPersonDialogProps> = ({
  open,
  orgId,
  onClose,
  person,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { updatePerson } = usePersonMutations(orgId, person.id);
  const {
    fieldsToUpdate,
    hasInvalidFields,
    hasUpdatedValues,
    invalidFields,
    onFieldValueChange,
    setFieldsToUpdate,
  } = useEditPerson(person, orgId);
  const [fieldValues, setFieldValues] = useState(person);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        setFieldsToUpdate({});
        onClose();
      }}
      open={open}
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        overflow="hidden"
        p={2}
      >
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          paddingBottom={2}
          width="100%"
        >
          <Typography variant="h4">
            <Msg
              id={messageIds.editPersonHeader}
              values={{ person: person.first_name + ' ' + person.last_name }}
            />
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box overflow="auto" width="100%">
          <EditPersonFields
            fieldValues={fieldValues}
            invalidFields={invalidFields}
            onChange={(field, newValue) => {
              onFieldValueChange(field, newValue);
              setFieldValues({ ...fieldValues, [field]: newValue });
            }}
            orgId={orgId}
          />
        </Box>
        <Box
          alignItems="center"
          component="div"
          display="flex"
          gap={2}
          justifyContent="flex-end"
          paddingTop={2}
          width="100%"
        >
          {hasUpdatedValues && (
            <Typography color={theme.palette.grey[500]}>
              <Msg
                id={messageIds.numberOfChangesMessage}
                values={{ number: Object.entries(fieldsToUpdate).length }}
              />
            </Typography>
          )}
          <Button
            disabled={!hasUpdatedValues}
            onClick={() => {
              setFieldsToUpdate({});
              setFieldValues(person);
            }}
          >
            <Msg id={messageIds.resetButton} />
          </Button>
          <Button
            disabled={!hasUpdatedValues || hasInvalidFields}
            onClick={() => {
              updatePerson(fieldsToUpdate);
              setFieldsToUpdate({});
              onClose();
            }}
            variant="contained"
          >
            <Msg id={messageIds.saveButton} />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditPersonDialog;
