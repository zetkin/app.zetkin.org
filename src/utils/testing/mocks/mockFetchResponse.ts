import { mockObject } from '.';

const response: Response = {
  arrayBuffer: async () => new ArrayBuffer(256),
  blob: async () => new Blob(),
  body: {} as ReadableStream,
  bodyUsed: false,
  clone: () => response,
  formData: async () => new FormData(),
  headers: new Headers(),
  json: async () => ({}),
  ok: true,
  redirected: false,
  status: 200,
  statusText: 'OK',
  text: async () => '',
  type: 'cors',
  url: '/api/route/to/resource',
};

const mockZetkinResponse = <R>(
  resBody?: R,
  overrides?: Partial<Response>
): Response => {
  // Will set json() to return the res body, but will ultimately use overrides if set
  const resBodyJsonFn = async () => resBody;
  return mockObject({ ...response, json: resBodyJsonFn }, overrides);
};

export default mockZetkinResponse;
