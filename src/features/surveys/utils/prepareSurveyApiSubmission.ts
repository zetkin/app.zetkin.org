import {
  ZetkinSurveyApiSubmission,
  ZetkinSurveyQuestionResponse,
  ZetkinSurveySignaturePayload,
} from 'utils/types/zetkin';

export default function prepareSurveyApiSubmission(
  formData: NodeJS.Dict<string | string[]>,
  isLoggedIn?: boolean
): ZetkinSurveyApiSubmission {
  const responses: ZetkinSurveyQuestionResponse[] = [];
  const responseEntries = Object.fromEntries(
    Object.entries(formData).filter(([name]) =>
      name.match(/^[0-9]+\.(options|text)$/)
    )
  );

  for (const name in responseEntries) {
    const value = responseEntries[name];
    const fields = name.split('.');
    const [id, type] = fields;

    if (type == 'text') {
      responses.push({
        question_id: parseInt(id),
        response: value as string,
      });
    }

    if (type === 'options' && typeof value === 'string') {
      responses.push({
        options: [parseInt(value, 10)],
        question_id: parseInt(id, 10),
      });
    }

    if (type === 'options' && Array.isArray(value)) {
      responses.push({
        options: value.map((o) => parseInt(o, 10)),
        question_id: parseInt(id, 10),
      });
    }
  }

  let signature: ZetkinSurveySignaturePayload = null;

  if (formData.sig === 'user' && isLoggedIn) {
    signature = 'user';
  }

  if (formData.sig == 'email') {
    signature = {
      email: formData['sig.email'] as string,
      first_name: formData['sig.first_name'] as string,
      last_name: formData['sig.last_name'] as string,
    };
  }

  return {
    responses,
    signature,
  };
}
