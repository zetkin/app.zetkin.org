'use client';

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
    <>
      {(status === 'editing' || status === 'error') && (
        <>
          <SurveyHeading
            status={status}
            survey={survey as ZetkinSurveyExtended}
          />
          <form action={action as unknown as string}>
            <input name="orgId" type="hidden" value={survey.organization.id} />
            <input name="surveyId" type="hidden" value={survey.id} />
            <SurveyElements survey={survey as ZetkinSurveyExtended} />
            <SurveySignature survey={survey as ZetkinSurveyExtended} />
            <SurveyPrivacyPolicy survey={survey as ZetkinSurveyExtended} />
            <SurveySubmitButton />
          </form>
        </>
      )}
      {status === 'submitted' && <SurveySuccess survey={survey} />}
    </>
  );
};

export default SurveyForm;
