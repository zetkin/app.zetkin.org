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

  return (
    <>
      <SurveyHeading status={status} survey={survey as ZetkinSurveyExtended} />
      <form action={action as unknown as string}>
        <SurveyElements survey={survey} />
        <SurveySignature survey={survey} />
        <SurveyPrivacyPolicy survey={survey} />
        <SurveySubmitButton />
      </form>
    </>
  );
};

export default SurveyForm;
