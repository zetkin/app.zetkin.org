import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCall } from 'features/call/types';
import useSubmitReport from 'features/call/hooks/useSubmitReport';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import CallHeader from './CallHeader';
import { previousCallAdd } from 'features/call/store';
import useAllocateCall from 'features/call/hooks/useAllocateCall';
import { objectToFormData } from '../utils/objectToFormData';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  forwardButtonLabel: string;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
};

const ReportHeader: FC<Props> = ({
  assignment,
  call,
  forwardButtonLabel,
  onSecondaryAction,
  secondaryActionLabel,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { submitReport } = useSubmitReport(assignment.organization.id);
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
      forwardButtonDisabled={!report.completed}
      forwardButtonLabel={forwardButtonLabel}
      forwardButtonLoading={isLoading}
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

        const result = await submitReport(call.id, report, submissions);

        if (result.kind === 'success') {
          const error = await allocateCall();
          if (!error) {
            dispatch(previousCallAdd(call));
          }
        }
        setIsLoading(false);
      }}
      onSecondaryAction={onSecondaryAction}
      secondaryActionLabel={secondaryActionLabel}
    />
  );
};

export default ReportHeader;
