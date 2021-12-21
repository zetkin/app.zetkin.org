import APIError from 'utils/apiError';

interface ZetkinApiResponse<G> {
    data?: G;
    error?: unknown;
}

const handleResponse = async <Result>(res: Response, method: string): Promise<Result> => {
    if (!res.ok) {
        throw new APIError(method, res.url);
    }

    const body = await res.json() as ZetkinApiResponse<Result>;

    if (!body.data) {
        throw new APIError(method, res.url, 'Response object did not contain property "data"');
    }

    return body.data;
};

export default handleResponse;