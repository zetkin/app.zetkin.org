import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';
import handleResponseData, {
  ZetkinApiErrorResponse,
  ZetkinApiSuccessResponse,
} from 'api/utils/handleResponseData';
import { ZetkinJourneyInstance, ZetkinTag } from 'utils/types/zetkin';

interface JourneyInstanceCloseBody {
  closed: string; // Datetime
  outcome?: string;
  tags?: ZetkinTag[];
}

const closeJourneyInstance = async (
  req: NextApiRequest,
  res: NextApiResponse<
    ZetkinApiSuccessResponse<ZetkinJourneyInstance> | ZetkinApiErrorResponse
  >
): Promise<void> => {
  const {
    query: { orgId, instanceId },
    method,
  } = req;

  const body = req?.body as JourneyInstanceCloseBody;

  // Return error if method other than POST
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const apiFetch = createApiFetch(req.headers);

  try {
    // Async put all tags
    if (body.tags) {
      await Promise.all(
        body.tags.map((tag: ZetkinTag) => {
          apiFetch(
            `/orgs/${orgId}/journey_instances/${instanceId}/tags/${tag.id}`,
            { method: 'PUT' }
          );
        })
      );
    }

    // Patch instance to close it
    const journeyInstanceRes = await apiFetch(
      `/orgs/${orgId}/journey_instances/${instanceId}`,
      {
        body: JSON.stringify({ closed: body.closed, outcome: body.outcome }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      }
    );

    const closedInstance = await handleResponseData<ZetkinJourneyInstance>(
      journeyInstanceRes,
      'patch'
    );

    res.status(200).json({ data: closedInstance });
  } catch (e) {
    res.status(500).json({
      error: {
        description: (e as Error).message,
        title: 'Error closing journey instance',
      },
    });
  }
};

export default closeJourneyInstance;
