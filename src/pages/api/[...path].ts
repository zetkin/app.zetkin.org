import type { NextApiRequest, NextApiResponse } from 'next';

import Z from 'zetkin';

const HTTP_VERBS_TO_ZETKIN_METHODS = {
    'DELETE': (resource) => resource.del(),
    'GET': (resource) => resource.get(),
    'PATCH': (resource, req) => resource.path(req.body),
    'POST': (resource, req) => resource.post(req.body),
    'PUT': (resource, req) => resource.put(req.body),
};

export default async function handle(req : NextApiRequest, res : NextApiResponse) : Promise<void> {
    const z = Z.construct();

    const path = req.query.path as string[];
    const resource = z.resource(path.join('/'));

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
