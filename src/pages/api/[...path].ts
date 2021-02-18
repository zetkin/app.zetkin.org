import Z from 'zetkin';
import { applySession } from 'next-session';
import type { NextApiRequest, NextApiResponse } from 'next';

import { AppSession } from '../../types';
import stringToBool from '../../utils/stringToBool';

const HTTP_VERBS_TO_ZETKIN_METHODS = {
    'DELETE': (resource) => resource.del(),
    'GET': (resource) => resource.get(),
    'PATCH': (resource, req) => resource.path(req.body),
    'POST': (resource, req) => resource.post(req.body),
    'PUT': (resource, req) => resource.put(req.body),
};

type NextApiRequestWithSession = NextApiRequest & {
    session: AppSession;
}

export default async function handle(req : NextApiRequestWithSession, res : NextApiResponse) : Promise<void> {
    const z = Z.construct({
        clientId: process.env.ZETKIN_CLIENT_ID,
        clientSecret: process.env.ZETKIN_CLIENT_SECRET,
        ssl: stringToBool(process.env.ZETKIN_USE_TLS),
        zetkinDomain: process.env.ZETKIN_API_HOST,
    });

    const path = req.query.path as string[];
    const resource = z.resource(path.join('/'));

    try {
        await applySession(req, res);
        z.setTokenData(req.session.tokenData);
    }
    catch (err) {
        // No problem if the session could not be found
    }

    try {
        const method = HTTP_VERBS_TO_ZETKIN_METHODS[req.method];
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
