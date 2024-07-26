import uniq from 'lodash/uniq';

import {
  ZetkinSurveyApiSubmission,
  ZetkinSurveyQuestionResponse,
  ZetkinSurveySignaturePayload,
} from 'utils/types/zetkin';

export default function prepareSurveyApiSubmission(
  formData: FormData,
  isLoggedIn?: boolean
): ZetkinSurveyApiSubmission {
  const responses: ZetkinSurveyQuestionResponse[] = [];
  const keys = uniq([...formData.keys()]);

  for (const name of keys) {
    if (!name.match(/^[0-9]+\.(options|text)$/)) {
      continue;
    }

    const value = formData.getAll(name);
    const fields = name.split('.');
    const [id, type] = fields;

    if (type == 'text') {
      responses.push({
        question_id: parseInt(id),
        response: value[0] as string,
      });
    }

    if (type === 'options' && typeof value === 'string') {
      responses.push({
        options: value == '' ? [] : [parseInt(value, 10)],
        question_id: parseInt(id, 10),
      });
    }

    if (type === 'options' && Array.isArray(value)) {
      responses.push({
        options: value
          .filter((o) => o !== '')
          .map((o) => parseInt(o.toString(), 10)),
        question_id: parseInt(id, 10),
      });
    }
  }

  let signature: ZetkinSurveySignaturePayload = null;

  const sig = formData.get('sig') as string | null;
  if (sig === 'user' && isLoggedIn) {
    signature = 'user';
  }

  if (sig == 'email') {
    signature = {
      email: formData.get('sig.email') as string,
      first_name: formData.get('sig.first_name') as string,
      last_name: formData.get('sig.last_name') as string,
    };
  }

  return {
    responses,
    signature,
  };
}
