import { IncomingHttpHeaders } from 'node:http';
import { stringToBool } from './stringUtils';

export type ApiFetch = (path: string, init?: RequestInit) => Promise<Response>;

export const createApiFetch = (headers: IncomingHttpHeaders): ApiFetch => {
    return (path,init) => {
        const protocol = stringToBool(process.env.ZETKIN_USE_TLS) ? 'https' : 'http';
        const apiUrl = `${protocol}://${process.env.ZETKIN_APP_HOST}/api${path}`;
        return fetch(apiUrl, {
            ...init,
            headers: {
                cookie: headers.cookie ||'',
                ...init?.headers,
            },
        });
    };
};
