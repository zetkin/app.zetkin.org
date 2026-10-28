import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  filtersUpdated,
  surveyDeselected,
  surveySubmissionDeleted,
  updateLaneStep,
} from '../store';
import { LaneStep } from '../types';
import useFilteredActivities from './useFilteredActivities';

export default function useSetupReportStep(orgId: number) {
  const dispatch = useAppDispatch();
  const submissionDataBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );
  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const { selectedSurveyId } = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const responseBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );
  const { surveys } = useFilteredActivities(orgId);

  return () => {
    dispatch(updateLaneStep(LaneStep.REPORT));

    const hasSurveySubmissions =
      Object.entries(submissionDataBySurveyId).length > 0;
    const hasEventSignups = lane.respondedEventIds.length > 0;

    if (hasSurveySubmissions || hasEventSignups) {
      dispatch(
        filtersUpdated({
          customDatesToFilterEventsBy: [null, null],
          eventDateFilterState: null,
          filterState: {
            alreadyIn: false,
            events: false,
            surveys: false,
            thisCall: true,
          },
          orgIdsToFilterEventsBy: [],
          projectIdsToFilterActivitiesBy: [],
        })
      );
    }

    const selectedSurvey =
      surveys.find((survey) => survey.id == selectedSurveyId) || null;

    if (selectedSurvey) {
      const response = responseBySurveyId[selectedSurvey.id];
      const hasMeaningfulContent =
        !!response &&
        Object.entries(response).some(([, value]) => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return value.length > 0;
        });

      if (hasMeaningfulContent) {
        dispatch(surveyDeselected());
      } else {
        dispatch(surveySubmissionDeleted(selectedSurvey.id));
      }
    }
  };
}
