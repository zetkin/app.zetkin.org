import { Box } from '@mui/material';
import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import useCallMutations from '../../hooks/useCallMutations';
import { LaneStep, ZetkinCall } from 'features/call/types';
import useAddSurveysSubmissions from 'features/call/hooks/useAddSurveysSubmissions';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { getAllStoredSurveysAsFormData } from '../utils/getAllStoredSurveysAsFormData';
import ZUIAlert from 'zui/components/ZUIAlert';
import CallHeader from './CallHeader';
import { previousCallAdd, updateLaneStep } from 'features/call/store';
import useAllocateCall from 'features/call/hooks/useAllocateCall';

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
  const [error, setError] = useState(false);
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

  const surveyKeys = useAppSelector((state) => state.call.filledSurveys);
  const filledSurveysContents = getAllStoredSurveysAsFormData(surveyKeys);

  return (
    <>
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

          const submissions = Object.entries(filledSurveysContents).map(
            ([key, formData]) => {
              const [, surveyId, targetId] = key.split('-');
              return {
                submission: prepareSurveyApiSubmission(formData),
                surveyId: Number(surveyId),
                targetId: Number(targetId),
              };
            }
          );
          const success = await submitSurveys(submissions);
          if (!success) {
            setError(true);
          } else {
            setError(false);
            await updateCall(call.id, report);
            sessionStorage.clear();
            const error = await allocateCall();
            if (!error) {
              dispatch(previousCallAdd(call));
              dispatch(updateLaneStep(LaneStep.PREPARE));
            }
          }

          setIsLoading(false);
        }}
        onSecondaryAction={onSecondaryAction}
        onSwitchCall={onSwitchCall}
        secondaryActionLabel={secondaryActionLabel}
      />
      {error && (
        <Box p={2}>
          <ZUIAlert
            severity={'error'}
            title={"There are errors in your survey's data"}
          />
        </Box>
      )}
    </>
  );
};

export default ReportHeader;
