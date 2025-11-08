import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingHttpHeaders } from 'http';

import { createApiFetch } from 'utils/apiFetch';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinQuery,
  ZetkinSurveyExtended,
  ZetkinView,
} from 'utils/types/zetkin';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/views/l10n/messageIds';
import surveyMessageIds from 'features/surveys/l10n/messageIds';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
} from 'features/views/components/types';

type ApiResponse<T> = { data: T } | { error: unknown };

const createShorterApiFetch = (headers: IncomingHttpHeaders) => {
  const baseApiFetch = createApiFetch(headers);

  return async <T, B = never>(
    path: string,
    body?: Partial<B>,
    init?: RequestInit
  ): Promise<T> => {
    const res = await baseApiFetch(path, {
      body: body ? JSON.stringify(body) : undefined,
      headers: body
        ? {
            'Content-Type': 'application/json',
            ...init?.headers,
          }
        : init?.headers,
      ...init,
    });
    const resBody = (await res.json()) as ApiResponse<T>;
    if ('error' in resBody) {
      throw new Error(
        `Api request failed due to ${JSON.stringify(resBody.error)}`
      );
    }
    return resBody.data;
  };
};

const createFromSurvey = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    orgId: orgIdStr,
    surveyId: surveyIdStr,
    folderId: folderIdStr,
  } = req.query;

  if (orgIdStr === undefined || surveyIdStr === undefined) {
    res.status(400).json({ error: 'Bad request' });
    return;
  }
  const orgId = parseInt(typeof orgIdStr === 'string' ? orgIdStr : orgIdStr[0]);
  const surveyId = parseInt(
    typeof surveyIdStr === 'string' ? surveyIdStr : surveyIdStr[0]
  );
  const folderId = folderIdStr
    ? parseInt(typeof folderIdStr === 'string' ? folderIdStr : folderIdStr[0])
    : undefined;

  const lang = getBrowserLanguage(req);

  const messages = await getServerMessages(lang, messageIds);
  const surveyMessages = await getServerMessages(lang, surveyMessageIds);
  const apiFetch = createShorterApiFetch(req.headers);

  try {
    const survey = await apiFetch<ZetkinSurveyExtended>(
      `/orgs/${orgId}/surveys/${surveyId}`
    );

    const view = await apiFetch<
      ZetkinView,
      ZetkinView & { folder_id?: number }
    >(
      `/orgs/${orgId}/people/views`,
      {
        folder_id: folderId || undefined,
        title: messages.newViewFromSurvey.title({
          surveyTitle: survey.title,
        }),
      },
      {
        method: 'POST',
      }
    );

    await apiFetch<ZetkinQuery, ZetkinQuery>(
      `/orgs/${orgId}/people/views/${view.id}/content_query`,
      {
        filter_spec: [
          {
            config: {
              operator: 'submitted',
              survey: surveyId,
            },
            op: OPERATION.ADD,
            type: FILTER_TYPE.SURVEY_SUBMISSION,
          },
        ],
      },
      {
        method: 'PATCH',
      }
    );

    await apiFetch(
      `/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          field: NATIVE_PERSON_FIELDS.FIRST_NAME,
        },
        title: surveyMessages.submissions.firstNameColumn(),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
      {
        method: 'POST',
      }
    );

    await apiFetch(
      `/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          field: NATIVE_PERSON_FIELDS.LAST_NAME,
        },
        title: surveyMessages.submissions.lastNameColumn(),
        type: COLUMN_TYPE.PERSON_FIELD,
      },
      {
        method: 'POST',
      }
    );

    for (const elem of survey.elements) {
      if (elem.type === ELEMENT_TYPE.TEXT) {
        continue;
      }

      await apiFetch(
        `/orgs/${orgId}/people/views/${view.id}/columns`,
        {
          config: {
            question_id: elem.id,
          },
          title: elem.question.question,
          type:
            elem.question.response_type === RESPONSE_TYPE.OPTIONS
              ? COLUMN_TYPE.SURVEY_OPTIONS
              : COLUMN_TYPE.SURVEY_RESPONSE,
        },
        {
          method: 'POST',
        }
      );
    }

    res.status(200).json({ data: view });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default createFromSurvey;
