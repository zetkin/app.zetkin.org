import { Box } from '@mui/material';
import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useAppSelector } from 'core/hooks';
import useCallMutations from '../../hooks/useCallMutations';
import { ZetkinCall } from 'features/call/types';
import useAddSurveysSubmissions from 'features/call/hooks/useAddSurveysSubmissions';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { getAllStoredSurveysAsFormData } from '../utils/getAllStoredSurveysAsFormData';
import ZUIAlert from 'zui/components/ZUIAlert';
import CallHeader from './CallHeader';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  forwardButtonLabel: string;
  onBack: () => void;
  onForward: () => void;
  onSecondaryAction?: () => void;
  onSwitchCall: () => void;
  secondaryActionLabel?: string;
};

const ReportHeader: FC<Props> = ({
  assignment,
  call,
  onBack,
  onForward,
  forwardButtonLabel,
  onSecondaryAction,
  secondaryActionLabel,
  onSwitchCall,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
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
    <>
      <CallHeader
        assignment={assignment}
        call={call}
        forwardButtonDisabled={!reportIsDone}
        forwardButtonLabel={forwardButtonLabel}
        forwardButtonLoading={isLoading}
        onBack={onBack}
        onForward={async () => {
          if (!reportIsDone) {
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
            await updateCall(call.id, callState.report!);
            sessionStorage.clear();
            onForward();
            setError(false);
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
