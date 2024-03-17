'use client';

import { Box } from '@mui/material';
import { FC } from 'react';
import { submit } from 'features/surveys/actions/submit';
import SurveyElements from './SurveyElements';
import SurveyHeading from './SurveyHeading';
import SurveyPrivacyPolicy from './SurveyPrivacyPolicy';
import SurveySignature from './SurveySignature';
import SurveySubmitButton from './SurveySubmitButton';
import SurveySuccess from './SurveySuccess';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';

// Type definitions for the new experimental stuff like useFormState in
// react-dom are lagging behind the implementation so it's necessary to silence
// the TypeScript error about the lack of type definitions here in order to
// import this.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useFormState } from 'react-dom';

export type SurveyFormProps = {
  survey: ZetkinSurveyExtended;
};

const SurveyForm: FC<SurveyFormProps> = ({ survey }) => {
  const [status, action] = useFormState<ZetkinSurveyFormStatus>(
    submit,
    'editing'
  );

  if (!survey) {
    return null;
  }

  return (
    <Box
      bgcolor="background.paper"
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <SurveyHeading status={status} survey={survey as ZetkinSurveyExtended} />
      {(status === 'editing' || status === 'error') && (
        <form action={action as unknown as string}>
          <input name="orgId" type="hidden" value={survey.organization.id} />
          <input name="surveyId" type="hidden" value={survey.id} />
          <Box display="flex" flexDirection="column" gap={4}>
            <SurveyElements survey={survey as ZetkinSurveyExtended} />
            <SurveySignature survey={survey as ZetkinSurveyExtended} />
            <SurveyPrivacyPolicy survey={survey as ZetkinSurveyExtended} />
            <SurveySubmitButton />
          </Box>
        </form>
      )}
      {status === 'submitted' && <SurveySuccess survey={survey} />}
    </Box>
  );
};

export default SurveyForm;
