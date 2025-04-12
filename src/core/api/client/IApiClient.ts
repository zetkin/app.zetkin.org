import { RPCDef } from 'core/rpc/types';

export interface IApiClientFetchOptions {
  abortOnNavigate?: boolean;
}

export default interface IApiClient {
  delete(path: string, options?: IApiClientFetchOptions): Promise<void>;
  put<DataType = void>(
    path: string,
    data?: Partial<DataType>,
    options?: IApiClientFetchOptions
  ): Promise<DataType>;
  get<DataType>(
    path: string,
    options?: IApiClientFetchOptions
  ): Promise<DataType>;
  patch<DataType, InputType = Partial<DataType>>(
    path: string,
    data: InputType,
    options?: IApiClientFetchOptions
  ): Promise<DataType>;
  post<DataType, InputType = DataType>(
    path: string,
    data: Partial<InputType>,
    options?: IApiClientFetchOptions
  ): Promise<DataType>;

  rpc<ParamsType, ResultType>(
    def: RPCDef<ParamsType, ResultType>,
    params: ParamsType,
    options?: IApiClientFetchOptions
  ): Promise<ResultType>;

  cancelRequests(): void;
}
