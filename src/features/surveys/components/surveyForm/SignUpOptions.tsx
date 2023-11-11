import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

interface SignUpOptionsProps {
  signature:
    | 'require_signature'
    | 'allow_anonymous'
    | 'force_anonymous'
    | undefined;
}
const SignUpOptions = ({ signature }: SignUpOptionsProps) => {
  const messages = useMessages(messageIds);

  return (
    <RadioGroup name="radio-buttons-group">
      <FormControlLabel
        control={<Radio />}
        label={messages.surveyForm.sign.nameAndEmail()}
        value={'name-and-mail'}
      />
      {signature === 'allow_anonymous' && (
        <FormControlLabel
          control={<Radio />}
          label={messages.surveyForm.sign.anonymous()}
          value={'anonymous'}
        />
      )}
    </RadioGroup>
  );
};

export default SignUpOptions;
