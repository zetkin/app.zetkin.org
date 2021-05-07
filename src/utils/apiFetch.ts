import apiUrl from './apiUrl';
import { IncomingHttpHeaders } from 'node:http';

export type ApiFetch = (path: string, init?: RequestInit) => Promise<Response>;

export const createApiFetch = (headers: IncomingHttpHeaders): ApiFetch => {
    return (path,init) => {
        return fetch(apiUrl(path), {
            ...init,
            headers: {
                cookie: headers.cookie ||'',
                ...init?.headers,
            },
        });
    };
};
