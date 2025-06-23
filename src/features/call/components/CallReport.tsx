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

type CallReportProps = {
  assignment: ZetkinCallAssignment;
};

const CallReport: FC<CallReportProps> = ({ assignment }) => {
  const call = useCurrentCall();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const surveyKeys = useAppSelector((state) => state.call.filledSurveys || []);

  const surveys = useSurveysWithElements(assignment.organization.id).data || [];
  const matchedSurveys = surveys
    .map((survey) => {
      const matchingKey = surveyKeys.find((key) => key.surveyId === survey.id);
      if (matchingKey) {
        return {
          survey,
          targetId: matchingKey.targetId,
        };
      }
      return null;
    })
    .filter(
      (item): item is { survey: typeof surveys[0]; targetId: number } =>
        item !== null
    );

  if (!call) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      width="100%"
    >
      <Box flex={isMobile ? 'none' : '4'} order={isMobile ? 2 : 1} p={2}>
        <ZUISection
          renderContent={() => (
            <Box>
              {matchedSurveys?.map((item) => (
                <SurveyCard
                  key={item.survey.id}
                  survey={item.survey}
                  targetId={item.targetId}
                />
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
  );
};

export default CallReport;
