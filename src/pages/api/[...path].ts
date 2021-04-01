//TODO: Enable eslint rules and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-var-requires */
import { applySession } from 'next-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { AppSession } from '../../types';
import stringToBool from '../../utils/stringToBool';
import { ZetkinZResource, ZetkinZResult } from '../../types/sdk';

//TODO: Create module definition and revert to import.
const Z = require('zetkin');

interface HttpVerbMethod {
    (resource : ZetkinZResource, req: NextApiRequestWithSession): Promise<ZetkinZResult>;
}

const HTTP_VERBS_TO_ZETKIN_METHODS : Record<string,HttpVerbMethod> = {
    'DELETE': (resource : ZetkinZResource) => resource.del(),
    'GET': (resource : ZetkinZResource) => resource.get(),
    'PATCH': (resource : ZetkinZResource, req : NextApiRequestWithSession) => resource.patch(req.body),
    'POST': (resource : ZetkinZResource, req : NextApiRequestWithSession) => resource.post(req.body),
    'PUT': (resource : ZetkinZResource, req : NextApiRequestWithSession) => resource.put(req.body),
};

type NextApiRequestWithSession = NextApiRequest & {
    session: AppSession;
};

export default async function handle(req : NextApiRequestWithSession, res : NextApiResponse) : Promise<void> {
    const path = req.query.path as string[];
    const pathStr = path.join('/');

    if (path[path.length-1] === 'avatar') {
        const protocol = stringToBool(process.env.ZETKIN_USE_TLS)? 'https' : 'http';
        const host = process.env.ZETKIN_API_HOST;
        const port = process.env.ZETKIN_API_PORT;

        try {
            const url = `${protocol}://${host}:${port}/v1/${pathStr}`;
            const result = await fetch(url, { redirect: 'manual' });
            const location = result.headers.get('location');
            const headers = location ? {
                location: location,
            } : undefined;
            res.writeHead(result.status, headers);

            return res.end();
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }

    const z = Z.construct({
        clientId: process.env.ZETKIN_CLIENT_ID,
        clientSecret: process.env.ZETKIN_CLIENT_SECRET,
        host: process.env.ZETKIN_API_HOST,
        port: process.env.ZETKIN_API_PORT,
        ssl: stringToBool(process.env.ZETKIN_USE_TLS),
    });

    const resource = z.resource(pathStr);

    try {
        await applySession(req, res);
        if (req.session.tokenData) {
            z.setTokenData(req.session.tokenData);
        }
    }
    catch (err) {
        // No problem if the session could not be found
    }

    try {
        const method = HTTP_VERBS_TO_ZETKIN_METHODS[req.method!];
        const result = await method(resource, req);
        res.status(result.httpStatus).json(result.data);
    }
    catch (err) {
        if (err.httpStatus) {
            res.status(err.httpStatus).json(err.data);
        }
        else {
            // Not an API error, i.e. this is a bug!
            throw err;
        }
    }
}
