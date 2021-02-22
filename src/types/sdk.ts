// TODO: Move these into SDK

export interface ZetkinZResult {
    data: {
        data: unknown
    }
}

export interface ZetkinZResource {
    delete: () => Promise<ZetkinZResult>;
    get: () => Promise<ZetkinZResult>;
    patch: () => Promise<ZetkinZResult>;
    post: () => Promise<ZetkinZResult>;
    put: () => Promise<ZetkinZResult>
}

export interface ZetkinZ {
    resource: (...args : string[]) => ZetkinZResource;
    setTokenData: (data : Record<string,unknown>) => void
}
