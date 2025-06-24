import { useAppDispatch } from 'core/hooks';
import { addSurveyKeys, clearSurveysKeys } from '../store';

export function useSurveysKeysMutations() {
  const dispatch = useAppDispatch();

  const addFilledSurveyKeys = (surveyId: number, targetId: number) => {
    dispatch(addSurveyKeys({ surveyId, targetId }));
  };

  const clearFilledSurveysKeys = () => {
    dispatch(clearSurveysKeys());
  };

  const clearSurveyResponses = (surveyId: number, targetId: number) => {
    const surveyKey = `formContent-${surveyId}-${targetId}`;
    localStorage.removeItem(surveyKey);
  };

  return {
    addFilledSurveyKeys,
    clearFilledSurveysKeys,
    clearSurveyResponses,
  };
}
