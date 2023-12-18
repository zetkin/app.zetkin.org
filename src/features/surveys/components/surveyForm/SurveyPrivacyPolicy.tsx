import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import SurveyOption from './SurveyOption';
import SurveySubheading from './SurveySubheading';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  Link,
  Typography,
} from '@mui/material';
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
    <FormControl>
      <FormGroup aria-labelledby="privacy-policy-label">
        <FormLabel id="privacy-policy-label">
          <SurveySubheading>
            <Msg id={messageIds.surveyForm.terms.title} />
          </SurveySubheading>
        </FormLabel>
        <SurveyOption
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
      </FormGroup>
    </FormControl>
  );
};

export default SurveyPrivacyPolicy;
