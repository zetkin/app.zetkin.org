'use client';

import { FC } from 'react';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

import SurveyElements from './SurveyElements';
import SurveyPrivacyPolicy from './SurveyPrivacyPolicy';
import SurveySignature from './SurveySignature';
import SurveySubmitButton from './SurveySubmitButton';

export type SurveyFormProps = {
  formData: NodeJS.Dict<string | string[]>;
  survey: ZetkinSurveyExtended;
};

const SurveyForm: FC<SurveyFormProps> = ({ formData, survey }) => {
  return (
    <form method="post">
      <SurveyElements formData={formData} survey={survey} />
      <SurveySignature formData={formData} survey={survey} />
      <SurveyPrivacyPolicy formData={formData} survey={survey} />
      <SurveySubmitButton />
    </form>
  );
};

export default SurveyForm;
