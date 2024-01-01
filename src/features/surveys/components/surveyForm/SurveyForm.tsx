'use client';

import SurveyElements from './SurveyElements';
import SurveyPrivacyPolicy from './SurveyPrivacyPolicy';
import SurveySignature from './SurveySignature';
import SurveySubmitButton from './SurveySubmitButton';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { FC, FormEvent } from 'react';

export type SurveyFormProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  survey: ZetkinSurveyExtended;
};

const SurveyForm: FC<SurveyFormProps> = ({ onSubmit, survey }) => {
  return (
    <form method="post" onSubmit={onSubmit}>
      <SurveyElements survey={survey} />
      <SurveySignature survey={survey} />
      <SurveyPrivacyPolicy survey={survey} />
      <SurveySubmitButton />
    </form>
  );
};

export default SurveyForm;
