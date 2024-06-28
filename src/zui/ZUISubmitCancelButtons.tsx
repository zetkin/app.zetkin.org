import { Box, Button, ButtonProps } from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from './l10n/messageIds';

const ZUISubmitCancelButtons: React.FunctionComponent<{
  onCancel: () => unknown;
  submitButtonProps?: ButtonProps & { 'data-testid': string };
  submitDisabled?: boolean;
  submitText?: string;
}> = ({ onCancel, submitButtonProps, submitDisabled, submitText }) => {
  return (
    <Box display="flex" justifyContent="flex-end" mt={2} width={1}>
      <Box m={1}>
        <Button
          color="primary"
          onClick={(ev) => {
            ev.stopPropagation();
            onCancel();
          }}
        >
          <Msg id={messageIds.submitOrCancel.cancel} />
        </Button>
      </Box>
      <Box m={1}>
        <Button
          color="primary"
          data-testid="SubmitCancelButtons-submitButton"
          disabled={submitDisabled}
          onClick={(ev) => ev.stopPropagation()}
          type="submit"
          variant="contained"
          {...submitButtonProps}
        >
          {submitText || <Msg id={messageIds.submitOrCancel.submit} />}
        </Button>
      </Box>
    </Box>
  );
};

export default ZUISubmitCancelButtons;
