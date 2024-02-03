import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';

import { CallAssignmentCaller } from 'features/callAssignments/apiTypes';
import { ZetkinTag } from 'utils/types/zetkin';
import { ApiFetch, createApiFetch } from 'utils/apiFetch';

const bodySchema = z.object({
  assignmentId: z.number(),
  callerId: z.number(),
  excludedTags: z.array(z.number()),
  orgId: z.number(),
  prioTags: z.array(z.number()),
});

export type BodySchema = z.infer<typeof bodySchema>;

export default async function setCallerTags(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error);
    return;
  }

  const { orgId, assignmentId, callerId, prioTags, excludedTags } = parsed.data;

  const apiFetch = createApiFetch(req.headers);
  const callerRes = await apiFetch(
    `/orgs/${orgId}/call_assignments/${assignmentId}/callers/${callerId}`
  );
  const callerData = (await callerRes.json()).data as CallAssignmentCaller;

  const basePath = `/orgs/${orgId}/call_assignments/${assignmentId}/callers/${callerId}`;
  const updatedPrioTags = await updateTags(
    apiFetch,
    basePath + '/prioritized_tags',
    callerData.prioritized_tags,
    prioTags
  );
  const updatedExcludedTags = await updateTags(
    apiFetch,
    basePath + '/excluded_tags',
    callerData.excluded_tags,
    excludedTags
  );

  res.status(200).json({
    data: {
      ...callerData,
      excluded_tags: updatedExcludedTags,
      prioritized_tags: updatedPrioTags,
    },
  });
}

async function updateTags(
  apiFetch: ApiFetch,
  basePath: string,
  existing: ZetkinTag[],
  requestedIds: number[]
): Promise<ZetkinTag[]> {
  // Find and add tags that should be assigned, but weren't
  const newTags: ZetkinTag[] = [];
  const newTagIds = requestedIds.filter(
    (tagId) => !existing.find((tag) => tag.id == tagId)
  );
  for (const tagId of newTagIds) {
    try {
      const addRes = await apiFetch(`${basePath}/${tagId}`, { method: 'PUT' });
      const addData = await addRes.json();
      newTags.push(addData.data as ZetkinTag);
    } catch (err) {
      // Supress errors
    }
  }

  // Find and remove tags that were assigned, but shouldn't be
  const removedTagIds: number[] = [];
  const removeTagIds = existing
    .filter((tag) => !requestedIds.includes(tag.id))
    .map((tag) => tag.id);

  for (const tagId of removeTagIds) {
    try {
      await apiFetch(`${basePath}/${tagId}`, { method: 'DELETE' });
      removedTagIds.push(tagId);
    } catch (err) {
      // Supress errors
    }
  }

  // Return tags after changes
  return existing
    .concat(newTags)
    .filter((tag) => !removedTagIds.includes(tag.id));
}
