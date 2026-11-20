import { ApiFetch } from 'utils/apiFetch';
import IApiClient from './IApiClient';
import { RPCDef, RPCRequestBody, RPCResponseBody } from 'core/rpc/types';
import { ApiClientError } from '../errors';
import { Api2Response } from 'core/api/types';

async function assertOk(res: Response) {
  if (!res.ok) {
    throw await ApiClientError.fromResponse(res);
  }
}

export default class FetchApiClient implements IApiClient {
  private _fetch: ApiFetch;

  constructor(fetch: ApiFetch) {
    this._fetch = fetch;
  }

  async delete(path: string): Promise<void> {
    const res = await this._fetch(path, {
      method: 'DELETE',
    });

    await assertOk(res);
  }

  get<DataType extends object, TRelated extends object = Record<string, never>>(
    path: `/api2/${string}`,
    receiveRelated: true
  ): Promise<Api2Response<DataType, TRelated>>;
  get<DataType>(path: string): Promise<DataType>;
  async get<DataType>(
    path: string,
    receiveRelated?: boolean
  ): Promise<
    | DataType
    | (DataType extends object | object[] ? Api2Response<DataType> : never)
  > {
    const res = await this._fetch(path);

    await assertOk(res);

    const body = await res.json();
    if (receiveRelated) {
      return body;
    }

    return body.data;
  }

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
  async patch<DataType, InputType = Partial<DataType>>(
    path: string,
    data: InputType,
    receiveRelated?: boolean
  ): Promise<
    | DataType
    | (DataType extends object | object[] ? Api2Response<DataType> : never)
  > {
    const res = await this._fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    await assertOk(res);

    if (res.status === 204) {
      return null as DataType;
    }

    const body = await res.json();
    if (receiveRelated) {
      return body;
    }
    return body.data;
  }

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
  async post<DataType, InputType = DataType>(
    path: string,
    data: Partial<InputType>,
    receiveRelated?: boolean
  ): Promise<
    | DataType
    | (DataType extends object | object[] ? Api2Response<DataType> : never)
  > {
    const res = await this._fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    await assertOk(res);

    if (res.status === 204) {
      return null as DataType;
    }

    const body = await res.json();
    if (receiveRelated) {
      return body;
    }
    return body?.data;
  }

  put<DataType extends object, TRelated extends object = Record<string, never>>(
    path: `/api2/${string}`,
    data: Partial<DataType> | undefined,
    receiveRelated: true
  ): Promise<Api2Response<DataType, TRelated>>;
  put<DataType = void>(
    path: string,
    data?: Partial<DataType>
  ): Promise<DataType>;
  async put<DataType = void>(
    path: string,
    data?: Partial<DataType> | undefined,
    receiveRelated?: boolean
  ): Promise<
    | DataType
    | (DataType extends object | object[] ? Api2Response<DataType> : never)
  > {
    const options: RequestInit = {
      method: 'PUT',
    };

    if (data) {
      options.body = JSON.stringify(data);
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    const res = await this._fetch(path, options);

    await assertOk(res);

    if (res.status === 204) {
      return null as DataType;
    }

    try {
      const body = await res.json();
      if (receiveRelated) {
        return body;
      }
      return body.data;
    } catch (err) {
      //TODO: Update type to reflect this possibility
      return null as unknown as DataType;
    }
  }

  async rpc<ParamsType, ResultType>(
    def: RPCDef<ParamsType, ResultType>,
    params: ParamsType
  ): Promise<ResultType> {
    const reqBody: RPCRequestBody<ParamsType> = {
      func: def.name,
      params,
    };

    const res = await this._fetch('/api/rpc', {
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const body = (await res.json()) as RPCResponseBody<ResultType>;

    return body.result;
  }
}
