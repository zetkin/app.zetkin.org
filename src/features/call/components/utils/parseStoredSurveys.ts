import { ZetkinSurveyCallSubmissionWithSurveyId } from 'features/call/types';
import { ZetkinSurveyQuestionResponse } from 'utils/types/zetkin';

export default function parseStoredSurveys(
  stored: Record<string, Record<string, string | string[]>>
): ZetkinSurveyCallSubmissionWithSurveyId[] {
  const submissions: ZetkinSurveyCallSubmissionWithSurveyId[] = [];

  for (const [key, content] of Object.entries(stored)) {
    const match = key.match(/^formContent-(\d+)-(\d+)$/);
    if (!match) {
      continue;
    }

    const surveyId = parseInt(match[1]);
    const signature = parseInt(match[2]);

    const responseMap = new Map<
      number,
      { options?: number[]; response?: string }
    >();

    for (const [questionKey, value] of Object.entries(content)) {
      const [idPart, subKey] = questionKey.split('.');
      const question_id = parseInt(idPart);
      if (isNaN(question_id)) {
        continue;
      }

      if (!responseMap.has(question_id)) {
        responseMap.set(question_id, {});
      }

      const current = responseMap.get(question_id)!;

      if (subKey === 'options') {
        if (!current.options) {
          current.options = [];
        }

        if (Array.isArray(value)) {
          current.options.push(...value.map((v) => Number(v)));
        } else {
          current.options.push(Number(value));
        }
      } else {
        current.response = String(value);
      }
    }

    const responses: ZetkinSurveyQuestionResponse[] = Array.from(
      responseMap.entries()
    ).map(([question_id, responseObj]) => ({
      question_id,
      ...(responseObj.options
        ? { options: responseObj.options }
        : { response: responseObj.response ?? '' }),
    }));

    submissions.push({
      responses,
      signature,
      surveyId,
    });
  }

  return submissions;
}
