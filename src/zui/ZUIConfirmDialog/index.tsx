import { Typography } from '@mui/material';

import { useMessages } from 'core/i18n';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

import messageIds from 'zui/l10n/messageIds';

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
  const messages = useMessages(messageIds);
  return (
    <ZUIDialog
      onClose={() => onCancel()}
      open={open}
      title={title || messages.confirmDialog.defaultTitle()}
    >
      <Typography variant="body1">
        {warningText || messages.confirmDialog.defaultWarningText()}
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
          submitText={messages.confirmDialog.button()}
        />
      </form>
    </ZUIDialog>
  );
};

export default ZUIConfirmDialog;
