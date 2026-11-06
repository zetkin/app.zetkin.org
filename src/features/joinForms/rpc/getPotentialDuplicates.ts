import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinPerson } from 'utils/types/zetkin';
import { ZetkinJoinSubmission } from 'features/joinForms/types';

const paramsSchema = z.object({
  orgId: z.number(),
});

export type PotentialDuplicate = {
  duplicates: ZetkinPerson[];
  id: number;
  submission: ZetkinJoinSubmission;
};

type Params = z.input<typeof paramsSchema>;
export type PotentialDuplicates = {
  potentialDuplicates: PotentialDuplicate[];
};

export const getPotentialDuplicatesDef = {
  handler: handle,
  name: 'getPotentialDuplicates',
  schema: paramsSchema,
};

export default makeRPCDef<Params, PotentialDuplicates>(
  getPotentialDuplicatesDef.name
);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<PotentialDuplicates> {
  const { orgId } = params;

  const submissions = await apiClient.get<ZetkinJoinSubmission[]>(
    `/api/orgs/${orgId}/join_submissions`
  );

  const pendingWithEmail = submissions.filter(
    (sub) => sub.state == 'pending' && sub.person_data.email
  );

  const potentialDuplicates = await getPotentialDuplicates(
    pendingWithEmail,
    orgId,
    apiClient
  );

  return {
    potentialDuplicates,
  };
}

export const getPotentialDuplicates = async (
  submissions: ZetkinJoinSubmission[],
  orgId: number,
  apiClient: IApiClient
): Promise<PotentialDuplicate[]> => {
  const results = await Promise.all(
    submissions.map((sub) =>
      apiClient
        .post<
          ZetkinPerson[],
          { q: string }
        >(`/api/orgs/${orgId}/search/person`, { q: sub.person_data.email! })
        .then((duplicates) => ({
          duplicates,
          id: sub.id,
          submission: sub,
        }))
    )
  );
  return results.filter((result) => result.duplicates.length > 0);
};
