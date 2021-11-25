export interface ZetkinAPIResponse<G> {
    data: G;
    error?: unknown;
}

export type MoxyHTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface Mock<G> {
    data?: G;
    headers?: Record<string, string>;
    status?: number;
}

export interface LoggedRequest<ReqData = unknown, ResData = unknown> {
    timestamp: Date;
    method: string;
    path: string;
    headers?: Record<string, string>;
    data?: ReqData;
    mocked: boolean;
    response: {
        data?: ResData;
        headers?:  Record<string, string>;
        status: number;
    };
}

export interface LoggedRequestsRes<ReqData, ResData> {
    log: LoggedRequest<ReqData, ResData>[];
    path?: string;
}
