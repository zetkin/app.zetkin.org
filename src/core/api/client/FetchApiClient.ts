import { ApiFetch } from 'utils/apiFetch';
import IApiClient from './IApiClient';
import { RPCDef, RPCRequestBody, RPCResponseBody } from 'core/rpc/types';
import { ApiClientError } from '../errors';

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

  async get<DataType>(path: string): Promise<DataType> {
    const res = await this._fetch(path);

    await assertOk(res);

    const body = await res.json();

    return body.data;
  }

  async patch<DataType, InputType = Partial<DataType>>(
    path: string,
    data: InputType
  ): Promise<DataType> {
    const res = await this._fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    await assertOk(res);

    const body = await res.json();
    return body.data;
  }

  async post<DataType, InputType = DataType>(
    path: string,
    data: Partial<InputType>
  ): Promise<DataType> {
    const res = await this._fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    await assertOk(res);

    const body = await res.json();
    return body.data;
  }

  async put<DataType = void>(
    path: string,
    data?: Partial<DataType> | undefined
  ): Promise<DataType> {
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

    try {
      const body = await res.json();
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
