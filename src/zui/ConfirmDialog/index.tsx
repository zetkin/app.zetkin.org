import { Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';

import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import ZetkinDialog from 'components/ZetkinDialog';

export interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  title?: string;
  warningText?: string;
  submitDisabled?: boolean;
}

const ConfirmDialog: React.FunctionComponent<ConfirmDialogProps> = ({
  open,
  onCancel,
  onSubmit,
  title,
  warningText,
  submitDisabled,
}) => {
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
        <SubmitCancelButtons
          onCancel={() => onCancel()}
          submitDisabled={submitDisabled}
          submitText={intl.formatMessage({
            id: 'misc.ConfirmDialog.button',
          })}
        />
      </form>
    </ZetkinDialog>
  );
};

export default ConfirmDialog;
