import { RPCDef } from 'core/rpc/types';
import { Api2Response } from 'core/api/types';

export default interface IApiClient {
  delete(path: string): Promise<void>;

  put<DataType extends object, TRelated extends object = Record<string, never>>(
    path: `/api2/${string}`,
    data: Partial<DataType> | undefined,
    receiveRelated: true
  ): Promise<Api2Response<DataType, TRelated>>;
  put<DataType = void>(
    path: string,
    data?: Partial<DataType>
  ): Promise<DataType>;

  get<DataType extends object, TRelated extends object = Record<string, never>>(
    path: `/api2/${string}`,
    receiveRelated: true
  ): Promise<Api2Response<DataType, TRelated>>;
  get<DataType>(path: string): Promise<DataType>;

  patch<
    DataType extends object,
    InputType = Partial<DataType>,
    TRelated extends object = Record<string, never>,
  >(
    path: `/api2/${string}`,
    data: Partial<InputType>,
    receiveRelated: true
  ): Promise<Api2Response<DataType, TRelated>>;
  patch<DataType, InputType = Partial<DataType>>(
    path: string,
    data: InputType
  ): Promise<DataType>;

  post<
    DataType extends object | object[],
    InputType = DataType,
    TRelated extends object = Record<string, never>,
  >(
    path: `/api2/${string}`,
    data: Partial<InputType>,
    receiveRelated: true
  ): Promise<Api2Response<DataType, TRelated>>;
  post<DataType, InputType = DataType>(
    path: string,
    data: Partial<InputType>
  ): Promise<DataType>;

  rpc<ParamsType, ResultType>(
    def: RPCDef<ParamsType, ResultType>,
    params: ParamsType
  ): Promise<ResultType>;
}
