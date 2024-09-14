import { FC } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  Link,
  Typography,
} from '@mui/material';

import messageIds from 'features/surveys/l10n/messageIds';
import SurveyContainer from './SurveyContainer';
import SurveyOption from './SurveyOption';
import SurveySubheading from './SurveySubheading';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { Msg } from 'core/i18n';

export type SurveyPrivacyPolicyProps = {
  survey: ZetkinSurveyExtended;
};

const SurveyPrivacyPolicy: FC<SurveyPrivacyPolicyProps> = ({ survey }) => {
  return (
    <FormControl fullWidth>
      <SurveyContainer paddingX={2}>
        <FormGroup aria-labelledby="privacy-policy-label">
          <Box display="flex" flexDirection="column" gap={1}>
            <FormLabel id="privacy-policy-label">
              <SurveySubheading>
                <Msg id={messageIds.surveyForm.terms.title} />
              </SurveySubheading>
            </FormLabel>
            <SurveyOption
              control={<Checkbox required />}
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
                href={
                  process.env.ZETKIN_PRIVACY_POLICY_LINK ||
                  'https://zetkin.org/privacy'
                }
                rel="noreferrer"
                target="_blank"
              >
                <Msg id={messageIds.surveyForm.policy.text} />
              </Link>
            </Typography>
          </Box>
        </FormGroup>
      </SurveyContainer>
    </FormControl>
  );
};

export default SurveyPrivacyPolicy;
