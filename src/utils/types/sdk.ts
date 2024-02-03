/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Move these into SDK

export interface ZetkinZResult {
  httpStatus: number;
  data: {
    data: unknown;
  };
}

export interface ZetkinZResource {
  del: () => Promise<ZetkinZResult>;
  get: (
    page?: any,
    perPage?: any,
    filters?: [string, string, string][]
  ) => Promise<ZetkinZResult>;
  patch: (data: any) => Promise<ZetkinZResult>;
  post: (data: any) => Promise<ZetkinZResult>;
  put: (data: any) => Promise<ZetkinZResult>;
}

export interface ZetkinTokenData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface ZetkinZ {
  resource: (...args: string[]) => ZetkinZResource;
  setTokenData: (data: ZetkinTokenData) => void;
  authenticate: (callbackUrl: string) => Promise<void>;
  getTokenData: () => ZetkinTokenData | null;
}
