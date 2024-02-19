import { getIronSession } from 'iron-session';
import http from 'http';
import https from 'https';
import { NextApiRequest, NextApiResponse } from 'next';

import { AppSession } from 'utils/types';
import requiredEnvVar from 'utils/requiredEnvVar';
import { stringToBool } from 'utils/stringUtils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  frontendReq: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  let tokenData: AppSession['tokenData'] | null;

  try {
    const session = await getIronSession<AppSession>(frontendReq, res, {
      cookieName: 'zsid',
      password: requiredEnvVar('SESSION_PASSWORD'),
    });
    tokenData = session.tokenData;
  } catch (err) {
    tokenData = null;
  }

  const accessToken = tokenData?.access_token;

  const { orgId } = frontendReq.query;
  const useHttps = stringToBool(process.env.ZETKIN_USE_TLS);
  const protocolPort = stringToBool(process.env.ZETKIN_USE_TLS) ? 443 : 80;
  const port = process.env.ZETKIN_API_PORT || protocolPort;
  const host = process.env.ZETKIN_API_HOST;
  const path = `/v1/orgs/${orgId as string}/files`;

  const client = useHttps ? https : http;

  await new Promise<void>((resolve) => {
    const apiReq = client.request(
      {
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          'Content-Type':
            frontendReq.headers['content-type'] || 'multipart/form-data',
        },
        host: host,
        method: frontendReq.method,
        path: path,
        port: port,
      },
      (apiRes) => {
        res.status(apiRes.statusCode!);
        res.setHeader('Content-Type', apiRes.headers['content-type']!);

        apiRes.on('data', (d) => {
          res.write(d);
        });

        apiRes.on('end', () => {
          res.end();
        });
      }
    );

    frontendReq.on('readable', () => {
      let chunk;
      while (null !== (chunk = frontendReq.read())) {
        apiReq.write(chunk);
      }
    });

    frontendReq.on('end', () => {
      apiReq.end();
      resolve();
    });
  });
}
