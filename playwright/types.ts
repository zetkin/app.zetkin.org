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
