'use client';

import { FC } from 'react';
import SurveyElements from './SurveyElements';
import SurveyHeading from './SurveyHeading';
import SurveyPrivacyPolicy from './SurveyPrivacyPolicy';
import SurveySignature from './SurveySignature';
import SurveySubmitButton from './SurveySubmitButton';
import useSurvey from 'features/surveys/hooks/useSurvey';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';

export type SurveyFormProps = {
  action: (formData: FormData) => Promise<void>;
  orgId: string;
  surveyId: string;
};

const SurveyForm: FC<SurveyFormProps> = ({ action, orgId, surveyId }) => {
  const status = 'editing' as ZetkinSurveyFormStatus;

  const { data: survey } = useSurvey(
    parseInt(orgId, 10),
    parseInt(surveyId, 10)
  );

  if (!survey) {
    return null;
  }

  return (
    <>
      <SurveyHeading status={status} survey={survey as ZetkinSurveyExtended} />
      <form action={action as unknown as string}>
        <input name="orgId" type="hidden" value={orgId} />
        <input name="surveyId" type="hidden" value={surveyId} />
        <SurveyElements survey={survey as ZetkinSurveyExtended} />
        <SurveySignature survey={survey as ZetkinSurveyExtended} />
        <SurveyPrivacyPolicy survey={survey as ZetkinSurveyExtended} />
        <SurveySubmitButton />
      </form>
    </>
  );
};

export default SurveyForm;
