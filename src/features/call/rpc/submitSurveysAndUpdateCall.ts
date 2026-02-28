import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import IApiClient from 'core/api/client/IApiClient';
import { ReportSubmissionResult, ZetkinUpdatedCall } from '../types';

const questionResponseSchema = z.union([
  z.object({ question_id: z.number(), response: z.string() }),
  z.object({ options: z.array(z.number()), question_id: z.number() }),
  z.object({ question_id: z.number() }),
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

const reportDataSchema = z.object({
  call_back_after: z.string().nullable(),
  message_to_organizer: z.string().nullable(),
  notes: z.string().nullable(),
  organizer_action_needed: z.boolean(),
  state: z.number(),
});

const submissionSchema = z.object({
  submission: z.object({
    responses: z.array(questionResponseSchema),
    signature: signatureSchema,
  }),
  surveyId: z.number(),
  targetId: z.number(),
});

export const paramsSchema = z.object({
  callId: z.number(),
  orgId: z.number(),
  reportData: reportDataSchema,
  submissions: z.array(submissionSchema),
});

type Params = z.input<typeof paramsSchema>;

export const submitSurveysDef = {
  handler: handle,
  name: 'submitSurveys',
  schema: paramsSchema,
};

export default makeRPCDef<Params, ReportSubmissionResult>(
  submitSurveysDef.name
);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<ReportSubmissionResult> {
  const { callId, orgId, reportData, submissions } = params;

  let failedSurveyId: number = 0;
  let failedTargetId: number = 0;

  try {
    for (const { surveyId, targetId, submission } of submissions) {
      failedSurveyId = surveyId;
      failedTargetId = targetId;

      await apiClient.post(
        `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
        {
          responses: submission.responses,
          signature: targetId,
        }
      );
    }
  } catch (err) {
    return {
      details: { surveyId: failedSurveyId, targetId: failedTargetId },
      kind: 'submissionError',
    };
  }

  try {
    const updatedCall = await apiClient.patch<ZetkinUpdatedCall>(
      `/api/orgs/${orgId}/calls/${callId}`,
      reportData
    );
    return { kind: 'success', updatedCall };
  } catch {
    return { kind: 'updateError' };
  }
}
