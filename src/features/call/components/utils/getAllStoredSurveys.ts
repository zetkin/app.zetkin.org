export const getAllStoredSurveys = (
  filledSurveys: { surveyId: number; targetId: number }[]
): Record<string, Record<string, string | string[]>> => {
  const contents: Record<string, Record<string, string | string[]>> = {};

  filledSurveys.forEach(({ surveyId, targetId }) => {
    const key = `formContent-${surveyId}-${targetId}`;
    const data = localStorage.getItem(key);

    if (data) {
      contents[key] = JSON.parse(data);
    }
  });

  return contents;
};
