//TODO: Enable eslint rules and fix errors
/* eslint-disable @typescript-eslint/no-var-requires */
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { AppSession } from 'utils/types';
import getFilters from 'utils/getFilters';
import requiredEnvVar from 'utils/requiredEnvVar';
import { stringToBool } from 'utils/stringUtils';
import { ZetkinZResource, ZetkinZResult } from 'utils/types/sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

//TODO: Create module definition and revert to import.
const Z = require('zetkin');

interface HttpVerbMethod {
  (resource: ZetkinZResource, req: NextApiRequest): Promise<ZetkinZResult>;
}

const HTTP_VERBS_TO_ZETKIN_METHODS: Record<string, HttpVerbMethod> = {
  DELETE: (resource: ZetkinZResource) => resource.del(),
  GET: (resource: ZetkinZResource, req: NextApiRequest) => {
    const filters = getFilters(req);
    return resource.get(null, null, filters);
  },
  PATCH: (resource: ZetkinZResource, req: NextApiRequest) =>
    resource.patch(req.body),
  POST: (resource: ZetkinZResource, req: NextApiRequest) =>
    resource.post(req.body),
  PUT: (resource: ZetkinZResource, req: NextApiRequest) =>
    resource.put(req.body),
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const path = req.query.path as string[];
  const queryParams = req.url?.split('?')[1];
  const pathStr = path.join('/');

  if (path[path.length - 1] === 'avatar') {
    const protocol = stringToBool(process.env.ZETKIN_USE_TLS)
      ? 'https'
      : 'http';
    const protocolPort = stringToBool(process.env.ZETKIN_USE_TLS) ? 443 : 80;
    const host = process.env.ZETKIN_API_HOST;
    const port = process.env.ZETKIN_API_PORT || protocolPort;

    try {
      const url = `${protocol}://${host}:${port}/v1/${pathStr}`;
      const result = await fetch(url, { redirect: 'manual' });
      const location = result.headers.get('location');
      const headers = location
        ? {
            location: location,
          }
        : undefined;
      res.writeHead(result.status, headers);

      return res.end();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  const z = Z.construct({
    clientId: process.env.ZETKIN_CLIENT_ID,
    clientSecret: process.env.ZETKIN_CLIENT_SECRET,
    host: process.env.ZETKIN_API_HOST,
    port: process.env.ZETKIN_API_PORT,
    ssl: stringToBool(process.env.ZETKIN_USE_TLS),
    zetkinDomain: process.env.ZETKIN_API_DOMAIN,
  });

  const resource = z.resource(pathStr + (queryParams ? '?' + queryParams : ''));

  try {
    const session = await getIronSession<AppSession>(req, res, {
      cookieName: 'zsid',
      password: requiredEnvVar('SESSION_PASSWORD'),
    });
    if (session.tokenData) {
      z.setTokenData(session.tokenData);
    }
  } catch (err) {
    // No problem if the session could not be found
  }

  try {
    const method = HTTP_VERBS_TO_ZETKIN_METHODS[req.method!];
    const result = await method(resource, req);

    const session = await getIronSession<AppSession>(req, res, {
      cookieName: 'zsid',
      password: requiredEnvVar('SESSION_PASSWORD'),
    });

    // Update session in case tokens were refreshed
    session.tokenData = z.getTokenData();
    await session.save();

    res.status(result.httpStatus).json(result.data);
  } catch (err) {
    if (err && typeof err === 'object' && 'httpStatus' in err) {
      const errRes = err as ZetkinZResult;
      res.status(errRes.httpStatus).json(errRes.data);
    } else {
      // Not an API error, i.e. this is a bug!
      throw err;
    }
  }
}
