import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinPerson,
  ZetkinSurveySubmission,
  ZetkinSurveySubmissionRespondent,
} from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
  surveyId: z.number(),
});

export type AutoLinkCandidate = {
  id: number;
  respondent: ZetkinSurveySubmissionRespondent;
  suggestion: ZetkinPerson;
};

type Params = z.input<typeof paramsSchema>;
export type AutoLinkableSubmissions = {
  autoLinkable: AutoLinkCandidate[];
  id: number;
};

export const getAutoLinkableSubmissionsDef = {
  handler: handle,
  name: 'getAutoLinkableSubmissions',
  schema: paramsSchema,
};

export default makeRPCDef<Params, AutoLinkableSubmissions>(
  getAutoLinkableSubmissionsDef.name
);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<AutoLinkableSubmissions> {
  const { orgId, surveyId } = params;

  const submissions = await apiClient.get<ZetkinSurveySubmission[]>(
    `/api/orgs/${orgId}/surveys/${surveyId}/submissions`
  );

  const unlinked = submissions.filter(
    (sub) => sub.respondent && !sub.respondent.id
  );
  const unlinkedWithRespondent = unlinked.filter(
    (sub) => sub.respondent?.email
  ) as ZetkinSurveySubmissionWithRespondent[];

  const autoLinkable = await getAutoLinkableSubmissions(
    unlinkedWithRespondent,
    orgId,
    apiClient
  );

  return {
    autoLinkable,
    id: surveyId,
  };
}

export type ZetkinSurveySubmissionWithRespondent = ZetkinSurveySubmission & {
  respondent: ZetkinSurveySubmissionRespondent;
};

export const getAutoLinkableSubmissions = async (
  submissions: ZetkinSurveySubmissionWithRespondent[],
  orgId: number,
  apiClient: IApiClient
) => {
  const suggestions = await Promise.all(
    submissions.map((sub) =>
      apiClient
        .post<ZetkinPerson[], { q: string }>(
          `/api/orgs/${orgId}/search/person`,
          { q: sub.respondent.email }
        )
        .then((sug) => ({
          submission: sub,
          suggestions: sug,
        }))
    )
  );
  const autoLinkable: AutoLinkCandidate[] = suggestions
    .map((sub) => {
      return {
        submission: sub.submission,
        suggestions:
          sub.suggestions.length <= 1
            ? sub.suggestions
            : sub.suggestions.filter((sug) => {
                return (
                  sug.first_name.toLowerCase() ===
                    sub.submission.respondent.first_name.toLowerCase() &&
                  sug.last_name.toLowerCase() ===
                    sub.submission.respondent.last_name.toLowerCase()
                );
              }),
      };
    })
    .filter((sug) => sug.suggestions.length === 1)
    .map((sug) => ({
      id: sug.submission.id,
      respondent: sug.submission.respondent,
      suggestion: sug.suggestions[0],
    }));
  return autoLinkable;
};
