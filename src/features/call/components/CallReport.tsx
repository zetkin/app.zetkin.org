import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ReportForm from './Report';
import ZUISection from 'zui/components/ZUISection';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { reportAdded } from '../store';
import useIsMobile from 'utils/hooks/useIsMobile';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
import SurveyCard from './SurveyCard';
import notEmpty from 'utils/notEmpty';
import ZUIAlert from 'zui/components/ZUIAlert';
import EventCard from './EventCard';
import { ZetkinCall } from '../types';
import ZUIText from 'zui/components/ZUIText';

type CallReportProps = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
};

const CallReport: FC<CallReportProps> = ({ assignment, call }) => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const surveySubmissionError = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].surveySubmissionError
  );

  const surveySubmissions = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );

  const idsOfSurveysWithSubmission = Object.entries(surveySubmissions)
    .filter(([, surveySubmissionData]) => {
      return Object.entries(surveySubmissionData).some(([, value]) => {
        if (typeof value == 'string') {
          return value.trim() !== '';
        }
        return true;
      });
    })
    .map(([surveyId]) => Number(surveyId));

  const allSurveys =
    useSurveysWithElements(assignment.organization.id).data || [];

  const surveys = idsOfSurveysWithSubmission
    .filter((surveyId) => {
      return allSurveys.find((s) => s.id == surveyId);
    })
    .map((surveyId) => {
      return allSurveys.find((s) => s.id == surveyId);
    })
    .filter(notEmpty);

  const respondedEventIds = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].respondedEventIds
  );
  const events = useAppSelector((state) => state.call.upcomingEventsList).items;

  const respondedEvents = respondedEventIds
    .map((eventId) => {
      return events.find((event) => event.id == eventId);
    })
    .filter(notEmpty);

  if (!call) {
    return null;
  }

  const noActivitesRespondedTo = surveys.length == 0 && events.length == 0;

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
                {noActivitesRespondedTo && (
                  <ZUIText>No activites were responded to</ZUIText>
                )}
                {surveys.map((survey) => (
                  <SurveyCard key={survey.id} survey={survey} />
                ))}
                {respondedEvents.map((e) => {
                  const event = e.data;
                  if (event) {
                    return (
                      <EventCard
                        key={e.id}
                        event={event}
                        target={call.target}
                      />
                    );
                  }
                })}
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
