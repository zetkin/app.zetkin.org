import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportForm from './Report';
import ZUISection from 'zui/components/ZUISection';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { reportAdded } from '../store';
import useIsMobile from 'utils/hooks/useIsMobile';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
import SurveyCard from './SurveyCard';
import notEmpty from 'utils/notEmpty';
import ZUIAlert from 'zui/components/ZUIAlert';

type CallReportProps = {
  assignment: ZetkinCallAssignment;
};

const CallReport: FC<CallReportProps> = ({ assignment }) => {
  const call = useCurrentCall();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const surveySubmissionError = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].surveySubmissionError
  );

  const surveyResponses = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].responseBySurveyId
  );

  const allSurveys =
    useSurveysWithElements(assignment.organization.id).data || [];

  const surveys = Object.keys(surveyResponses)
    .filter((surveyId) => {
      return allSurveys.find((s) => s.id == Number(surveyId));
    })
    .map((surveyId) => {
      return allSurveys.find((s) => s.id == Number(surveyId));
    })
    .filter(notEmpty);

  if (!call) {
    return null;
  }

  return (
    <>
      {surveySubmissionError && (
        <Box p={2}>
          <ZUIAlert
            severity={'error'}
            title="There was an error submitting surveys"
          />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        width="100%"
      >
        <Box flex={isMobile ? 'none' : '4'} order={isMobile ? 2 : 1} p={2}>
          <ZUISection
            renderContent={() => (
              <Box>
                {surveys.map((survey) => (
                  <SurveyCard key={survey.id} survey={survey} />
                ))}
              </Box>
            )}
            title="Activities"
          />
        </Box>
        <Box flex={isMobile ? 'none' : '6'} order={isMobile ? 1 : 2} p={2}>
          <ZUISection
            renderContent={() => (
              <ReportForm
                disableCallerNotes={assignment.disable_caller_notes}
                onReportFinished={(report) => {
                  dispatch(reportAdded(report));
                }}
                target={call.target}
              />
            )}
            title="Report"
          />
        </Box>
      </Box>
    </>
  );
};

export default CallReport;
