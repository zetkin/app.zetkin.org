import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button } from '@mui/material';

const ZUISubmitCancelButtons: React.FunctionComponent<{
  onCancel: () => unknown;
  submitDisabled?: boolean;
  submitText?: string;
}> = ({ onCancel, submitDisabled, submitText }) => {
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
        >
          {submitText || <Msg id="misc.formDialog.submit" />}
        </Button>
      </Box>
    </Box>
  );
};

export default ZUISubmitCancelButtons;
