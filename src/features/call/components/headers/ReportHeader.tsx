import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useAppSelector } from 'core/hooks';
import useCallMutations from '../../hooks/useCallMutations';
import StepsHeader from './StepsHeader';
import { ZetkinCall } from 'features/call/types';
import useAddSurveysSubmissions from 'features/call/hooks/useAddSurveysSubmissions';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { getAllStoredSurveysAsFormData } from '../utils/getAllStoredSurveysAsFormData';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  onBack: () => void;
  onPrimaryAction: () => void;
  onPrimaryActionLabel: string;
  onSecondaryAction?: () => void;
  onSecondaryActionLabel?: string;
  onSwitchCall: () => void;
};

const ReportHeader: FC<Props> = ({
  assignment,
  call,
  onBack,
  onPrimaryAction,
  onPrimaryActionLabel,
  onSecondaryAction,
  onSecondaryActionLabel,
  onSwitchCall,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCall } = useCallMutations(assignment.organization.id);
  const stateList = useAppSelector((state) => state.call.stateByCallId);
  const { submitSurveys } = useAddSurveysSubmissions(
    assignment.organization.id
  );
  const callState = stateList[call.id]?.data;
  const reportIsDone = callState && !!callState.report;

  const surveyKeys = useAppSelector((state) => state.call.filledSurveys);
  const filledSurveysContents = getAllStoredSurveysAsFormData(surveyKeys);

  return (
    <StepsHeader
      assignment={assignment}
      call={call}
      forwardButtonDisabled={!reportIsDone}
      forwardButtonIsLoading={isLoading}
      onBack={onBack}
      onPrimaryAction={async () => {
        if (reportIsDone) {
          setIsLoading(true);
          await updateCall(call.id, callState.report);
          if (sessionStorage) {
            const submissions = Object.entries(filledSurveysContents).map(
              ([key, formData]) => {
                const [, surveyId, targetId] = key.split('-');
                return {
                  submission: prepareSurveyApiSubmission(formData),
                  surveyId: parseInt(surveyId),
                  targetId: parseInt(targetId),
                };
              }
            );

            await submitSurveys(submissions);
          }
          sessionStorage.clear();
          //TODO: Error handling
          onPrimaryAction();
          setIsLoading(false);
        }
      }}
      onPrimaryActionLabel={onPrimaryActionLabel}
      onSecondaryAction={onSecondaryAction}
      onSecondaryActionLabel={onSecondaryActionLabel}
      onSwitchCall={onSwitchCall}
    />
  );
};

export default ReportHeader;
