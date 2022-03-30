import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { useIntl } from 'react-intl';
import ZetkinDialog from 'components/ZetkinDialog';

import { TextField, Typography } from '@material-ui/core';

export interface ZetkinTextConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  title?: string;
  warningText?: string;
  submitDisabled?: boolean;
  defaultValue?: string;
  submitText?: string;
}

const ZetkinTextConfirmDialog: React.FunctionComponent<
  ZetkinTextConfirmDialogProps
> = ({ open, onCancel, onSubmit, title, warningText, submitDisabled, defaultValue, submitText}) => {
  const intl = useIntl();
  return (
    <ZetkinDialog
      onClose={() => onCancel()}
      open={open}
      title={
        title || intl.formatMessage({ id: 'misc.ConfirmDialog.defaultTitle' })
      }
    >
      <Typography variant="body1">
        {warningText ||
          intl.formatMessage({
            id: 'misc.ConfirmDialog.defaultWarningText',
          })}
      </Typography>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmit();
        }}
      > 
        <TextField
          fullWidth
          id="user_input"
          defaultValue={defaultValue}
          label="Filename"
          margin="normal"
          name="user_input"
          variant="filled"
          size="small"
        />
        <SubmitCancelButtons
          onCancel={() => onCancel()}
          submitDisabled={submitDisabled}
          submitText={submitText || intl.formatMessage({
            id: 'misc.ConfirmDialog.button',
          })}
        />
      </form>
    </ZetkinDialog>
  );
};

export default ZetkinTextConfirmDialog;
