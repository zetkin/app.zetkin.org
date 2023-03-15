import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
  surveyId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
export type SurveyStats = {
  id: number;
  submissionCount: number;
  submissionsByDay: {
    accumulatedSubmissions: number;
    date: string;
  }[];
  unlinkedSubmissionCount: number;
};

export const getSurveyStatsDef = {
  handler: handle,
  name: 'getSurveyStats',
  schema: paramsSchema,
};

export default makeRPCDef<Params, SurveyStats>(getSurveyStatsDef.name);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<SurveyStats> {
  const { orgId, surveyId } = params;
  const submissionsByDay: SurveyStats['submissionsByDay'] = [];

  const submissions = await apiClient.get<ZetkinSurveySubmission[]>(
    `/api/orgs/${orgId}/surveys/${surveyId}/submissions`
  );

  let sum = 0;
  const unlinkedCount = submissions.filter(
    (sub) => sub.respondent && !sub.respondent.id
  ).length;

  const sortedSubmissions = submissions
    .filter((sub) => sub.submitted)
    .sort((sub0, sub1) => {
      const date0 = new Date(sub0.submitted);
      const date1 = new Date(sub1.submitted);
      return date0.getTime() - date1.getTime();
    });

  if (sortedSubmissions.length) {
    const curDate = new Date(sortedSubmissions[0].submitted.slice(0, 10));
    const lastDate = new Date();

    // Rewind one day before starting
    curDate.setDate(curDate.getDate() - 1);

    while (curDate <= lastDate) {
      const dateStr = curDate.toISOString().slice(0, 10);
      const subsOnDate = sortedSubmissions.filter((sub) =>
        sub.submitted.startsWith(dateStr)
      );

      sum += subsOnDate.length;

      submissionsByDay.push({
        accumulatedSubmissions: sum,
        date: dateStr,
      });

      curDate.setDate(curDate.getDate() + 1);
    }
  }

  return {
    id: surveyId,
    submissionCount: submissions.length,
    submissionsByDay: submissionsByDay.slice(-365),
    unlinkedSubmissionCount: unlinkedCount,
  };
}
