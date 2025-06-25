import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import useCallMutations from '../../hooks/useCallMutations';
import { ZetkinCall } from 'features/call/types';
import useAddSurveysSubmissions from 'features/call/hooks/useAddSurveysSubmissions';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import CallHeader from './CallHeader';
import { previousCallAdd } from 'features/call/store';
import useAllocateCall from 'features/call/hooks/useAllocateCall';
import { objectToFormData } from '../utils/objectToFormData';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  forwardButtonLabel: string;
  onBack: () => void;
  onSecondaryAction?: () => void;
  onSwitchCall: () => void;
  secondaryActionLabel?: string;
};

const ReportHeader: FC<Props> = ({
  assignment,
  call,
  onBack,
  forwardButtonLabel,
  onSecondaryAction,
  secondaryActionLabel,
  onSwitchCall,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { updateCall } = useCallMutations(assignment.organization.id);
  const { submitSurveys } = useAddSurveysSubmissions(
    assignment.organization.id
  );
  const { allocateCall } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );

  const report = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].report
  );
  const submissionDataBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );

  return (
    <CallHeader
      assignment={assignment}
      call={call}
      forwardButtonDisabled={!report}
      forwardButtonLabel={forwardButtonLabel}
      forwardButtonLoading={isLoading}
      onBack={onBack}
      onForward={async () => {
        if (!report) {
          return;
        }
        setIsLoading(true);

        const submissions = Object.entries(submissionDataBySurveyId)
          .filter(([, surveySubmissionData]) => {
            return Object.entries(surveySubmissionData).some(([, value]) => {
              if (typeof value == 'string') {
                return value.trim() !== '';
              }
              return true;
            });
          })
          .map(([surveyId, surveySubmissionData]) => {
            const surveySubmissionDataAsFormData =
              objectToFormData(surveySubmissionData);
            return {
              submission: prepareSurveyApiSubmission(
                surveySubmissionDataAsFormData
              ),
              surveyId: Number(surveyId),
              targetId: call.target.id,
            };
          });

        //TODO: Make all below happen in one hook
        await submitSurveys(submissions);
        await updateCall(call.id, report);

        sessionStorage.clear();

        const error = await allocateCall();

        if (!error) {
          dispatch(previousCallAdd(call));
        }
        setIsLoading(false);
      }}
      onSecondaryAction={onSecondaryAction}
      onSwitchCall={onSwitchCall}
      secondaryActionLabel={secondaryActionLabel}
    />
  );
};

export default ReportHeader;
