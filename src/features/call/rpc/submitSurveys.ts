import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import IApiClient from 'core/api/client/IApiClient';

const questionResponseSchema = z.union([
  z.object({ question_id: z.number(), response: z.string() }),
  z.object({ options: z.array(z.number()), question_id: z.number() }),
]);

const signatureSchema = z.union([
  z.null(),
  z.literal('user'),
  z.object({
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
  }),
]);

export const submissionSchema = z.object({
  submission: z.object({
    responses: z.array(questionResponseSchema),
    signature: signatureSchema,
  }),
  surveyId: z.number(),
  targetId: z.number(),
});

export const paramsSchema = z.object({
  orgId: z.number(),
  submissions: z.array(submissionSchema),
});

type Params = z.input<typeof paramsSchema>;

export type SubmitSurveysResultItem = {
  success: true;
  surveyId: number;
  targetId: number;
};

type Result = SubmitSurveysResultItem[];

export const submitSurveysDef = {
  handler: handle,
  name: 'submitSurveys',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(submitSurveysDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId, submissions } = params;
  const results: Result = [];

  for (const { surveyId, targetId, submission } of submissions) {
    try {
      await apiClient.post(
        `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
        {
          responses: submission.responses,
          // overwrite signature with targetId
          signature: targetId,
        }
      );
      results.push({ success: true, surveyId, targetId });
    } catch (err) {
      const msg = `Failed to submit survey ${surveyId} for target ${targetId}`;
      throw new Error(msg);
    }
  }

  return results;
}
