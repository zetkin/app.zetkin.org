'use client';

import { FC } from 'react';
import SurveyElements from './SurveyElements';
import SurveyHeading from './SurveyHeading';
import SurveyPrivacyPolicy from './SurveyPrivacyPolicy';
import SurveySignature from './SurveySignature';
import SurveySubmitButton from './SurveySubmitButton';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';

export type SurveyFormProps = {
  action: (formData: FormData) => Promise<void>;
  survey: ZetkinSurveyExtended;
};

const SurveyForm: FC<SurveyFormProps> = ({ action, survey }) => {
  const status = 'editing' as ZetkinSurveyFormStatus;

  if (!survey) {
    return null;
  }

  return (
    <>
      <SurveyHeading status={status} survey={survey as ZetkinSurveyExtended} />
      <form action={action as unknown as string}>
        <input name="orgId" type="hidden" value={survey.organization.id} />
        <input name="surveyId" type="hidden" value={survey.id} />
        <SurveyElements survey={survey as ZetkinSurveyExtended} />
        <SurveySignature survey={survey as ZetkinSurveyExtended} />
        <SurveyPrivacyPolicy survey={survey as ZetkinSurveyExtended} />
        <SurveySubmitButton />
      </form>
    </>
  );
};

export default SurveyForm;
