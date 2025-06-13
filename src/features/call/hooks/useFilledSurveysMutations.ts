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

  return {
    addFilledSurveyKeys,
    clearFilledSurveysKeys,
  };
}
