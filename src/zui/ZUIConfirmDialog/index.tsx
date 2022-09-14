import { Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';

import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

export interface ZUIConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  title?: string;
  warningText?: string;
  submitDisabled?: boolean;
}

const ZUIConfirmDialog: React.FunctionComponent<ZUIConfirmDialogProps> = ({
  open,
  onCancel,
  onSubmit,
  title,
  warningText,
  submitDisabled,
}) => {
  const intl = useIntl();
  return (
    <ZUIDialog
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
        <ZUISubmitCancelButtons
          onCancel={() => onCancel()}
          submitDisabled={submitDisabled}
          submitText={intl.formatMessage({
            id: 'misc.ConfirmDialog.button',
          })}
        />
      </form>
    </ZUIDialog>
  );
};

export default ZUIConfirmDialog;
