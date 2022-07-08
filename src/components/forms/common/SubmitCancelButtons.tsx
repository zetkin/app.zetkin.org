import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, ButtonProps } from '@material-ui/core';

const SubmitCancelButtons: React.FunctionComponent<{
  onCancel: () => unknown;
  submitButtonProps?: ButtonProps & { 'data-testid': string };
  submitDisabled?: boolean;
  submitText?: string;
}> = ({ onCancel, submitButtonProps, submitDisabled, submitText }) => {
  return (
    <Box display="flex" justifyContent="flex-end" mt={2} width={1}>
      <Box m={1}>
        <Button color="primary" onClick={onCancel}>
          <Msg id="misc.formDialog.cancel" />
        </Button>
      </Box>
      <Box m={1}>
        <Button
          color="primary"
          data-testid="SubmitCancelButtons-submitButton"
          disabled={submitDisabled}
          type="submit"
          variant="contained"
          {...submitButtonProps}
        >
          {submitText || <Msg id="misc.formDialog.submit" />}
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitCancelButtons;
