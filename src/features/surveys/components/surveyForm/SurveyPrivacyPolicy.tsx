import Box from '@mui/material/Box';
import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { Checkbox, FormControlLabel, Link, Typography } from '@mui/material';
import { Msg, useMessages } from 'core/i18n';

export type SurveyPrivacyPolicyProps = {
  formData: NodeJS.Dict<string | string[]>;
  survey: ZetkinSurveyExtended;
};

const SurveyPrivacyPolicy: FC<SurveyPrivacyPolicyProps> = ({
  formData,
  survey,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Box alignItems="center" component="section" sx={{ py: 2 }}>
      <Typography fontWeight={'bold'}>
        <Msg id={messageIds.surveyForm.terms.title} />
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            defaultChecked={formData['privacy.approval'] === 'on'}
            required
          />
        }
        data-testid="Survey-acceptTerms"
        label={<Msg id={messageIds.surveyForm.accept} />}
        name="privacy.approval"
      />
      <Typography style={{ fontSize: '0.8em' }}>
        <Msg
          id={messageIds.surveyForm.terms.description}
          values={{ organization: survey.organization.title }}
        />
      </Typography>
      <Typography style={{ fontSize: '0.8em', marginBottom: '0.5em' }}>
        <Link
          href={messages.surveyForm.policy.link()}
          rel="noreferrer"
          target="_blank"
        >
          <Msg id={messageIds.surveyForm.policy.text} />
        </Link>
      </Typography>
    </Box>
  );
};

export default SurveyPrivacyPolicy;
