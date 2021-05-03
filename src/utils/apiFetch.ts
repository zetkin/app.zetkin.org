import apiUrl from './apiUrl';

export interface RequestWithHeaders {
    headers: Record<string, string>;
}

export type ApiFetch = (path: string, init?: RequestInit) => Promise<Response>;

export const createApiFetch = (req: RequestWithHeaders): ApiFetch => {
    return (path,init) => {
        return fetch(apiUrl(path), {
            ...init,
            headers: {
                cookie: req.headers.cookie ||'',
                ...init?.headers,
            },
        });
    };
};
