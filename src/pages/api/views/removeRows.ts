import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';

export interface RemoveRowsReqBody {
  rows?: number[];
}

export default async function createNewView(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    query: { orgId, viewId },
    method,
    body,
  } = req;
  const { rows } = body as RemoveRowsReqBody;

  // Return error if method other than POST
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!rows) {
    res.status(400).end('Missing rows');
    return;
  }

  const client = new BackendApiClient(req.headers);

  try {
    await Promise.all(
      rows.map((personId) =>
        client.delete(
          `/api/orgs/${orgId}/people/views/${viewId}/rows/${personId}`
        )
      )
    );

    res.status(200).json({});
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
