import apiUrl from '../utils/apiUrl';

export function defaultFetch(path : string, init? : RequestInit) : Promise<Response> {
    const url = apiUrl(path);
    return fetch(url, init);
}