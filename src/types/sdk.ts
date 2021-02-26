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
    get: () => Promise<ZetkinZResult>;
    patch: (data : any) => Promise<ZetkinZResult>;
    post: (data : any) => Promise<ZetkinZResult>;
    put: (data : any) => Promise<ZetkinZResult>;
}

export interface ZetkinZ {
    resource: (...args : string[]) => ZetkinZResource;
    setTokenData: (data : Record<string,unknown>) => void;
}
