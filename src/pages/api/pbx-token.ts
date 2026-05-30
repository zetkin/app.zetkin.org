import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { AppSession } from 'utils/types';
import requiredEnvVar from 'utils/requiredEnvVar';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getIronSession<AppSession>(req, res, {
    cookieName: 'zsid',
    password: requiredEnvVar('SESSION_PASSWORD'),
  });

  if (!session.tokenData?.access_token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.status(200).json({ token: session.tokenData.access_token });
}
