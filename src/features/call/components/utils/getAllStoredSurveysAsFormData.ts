import { objectToFormData } from './objectToFormData';

export const getAllStoredSurveysAsFormData = (
  filledSurveys: { surveyId: number; targetId: number }[]
): Record<string, FormData> => {
  const contents: Record<string, FormData> = {};

  filledSurveys.forEach(({ surveyId, targetId }) => {
    const key = `formContent-${surveyId}-${targetId}`;
    const data = localStorage.getItem(key);

    if (data) {
      const parsed = JSON.parse(data) as Record<string, string | string[]>;
      contents[key] = objectToFormData(parsed);
    }
  });

  return contents;
};
