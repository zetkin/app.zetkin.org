import { RPCDef } from 'core/rpc/types';
import { Api2Response } from 'core/api/types';

export default interface IApiClient {
  delete(path: string): Promise<void>;
  put<DataType = void>(
    path: string,
    data?: Partial<DataType>
  ): Promise<DataType>;
  get<DataType>(path: string): Promise<DataType>;
  getEnvelope<DataType, RelatedType = unknown>(
    path: `/api2/${string}`
  ): Promise<Api2Response<DataType, RelatedType>>;
  patch<DataType, InputType = Partial<DataType>>(
    path: string,
    data: InputType
  ): Promise<DataType>;
  post<DataType, InputType = DataType>(
    path: string,
    data: Partial<InputType>
  ): Promise<DataType>;

  rpc<ParamsType, ResultType>(
    def: RPCDef<ParamsType, ResultType>,
    params: ParamsType
  ): Promise<ResultType>;
}
