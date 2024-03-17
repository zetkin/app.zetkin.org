import {
  ZetkinSurveyApiSubmission,
  ZetkinSurveyQuestionResponse,
  ZetkinSurveySignaturePayload,
  ZetkinUser,
} from 'utils/types/zetkin';

export default function prepareSurveyApiSubmission(
  formData: Record<string, unknown>,
  user: ZetkinUser | null
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

  if (formData.sig === 'user' && user) {
    signature = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
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
