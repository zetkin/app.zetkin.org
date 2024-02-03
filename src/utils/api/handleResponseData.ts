import APIError from 'utils/apiError';

export interface ZetkinApiSuccessResponse<G> {
  data: G;
}

export interface ZetkinApiErrorResponse {
  error: {
    description: string;
    title: string;
  };
}

const handleResponseData = async <Result>(
  res: Response,
  method: string
): Promise<Result> => {
  if (!res.ok) {
    let errorBody: ZetkinApiErrorResponse;
    try {
      // Check if there is a body with the error
      errorBody = await res.json();
    } catch {
      // If no body, throw simple error
      throw new APIError(method, res.url);
    }
    throw new APIError(method, res.url, errorBody?.error?.description);
  }

  const body = (await res.json()) as ZetkinApiSuccessResponse<Result>;

  if (!body.data) {
    throw new APIError(
      method,
      res.url,
      'Response object did not contain property "data"'
    );
  }

  return body.data;
};

export default handleResponseData;
