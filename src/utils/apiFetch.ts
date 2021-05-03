import apiUrl from './apiUrl';
import { IncomingMessage } from 'node:http';
import { NextApiRequest } from 'next';

const createApiFetch = (req: NextApiRequest | IncomingMessage) => {
    return (
        path: string,
        init?: RequestInit,
    ) : Promise<Response> => {
        return fetch(apiUrl(path), {
            ...init,
            headers: {
                cookie: req.headers.cookie ||'',
                ...init?.headers,
            },
        });
    };
};

export default createApiFetch;