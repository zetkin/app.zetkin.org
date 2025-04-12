import { ApiFetch } from 'utils/apiFetch';
import IApiClient, { IApiClientFetchOptions } from './IApiClient';
import { RPCDef, RPCRequestBody, RPCResponseBody } from 'core/rpc/types';
import { ApiClientError } from '../errors';

function assertOk(res: Response) {
  if (!res.ok) {
    throw ApiClientError.fromResponse(res);
  }
}

export default class FetchApiClient implements IApiClient {
  private _abortController = new AbortController();
  private _fetch: ApiFetch;

  private addAbortSignal(
    options: IApiClientFetchOptions | undefined
  ): AbortSignal | null {
    return options?.abortOnNavigate ? this._abortController.signal : null;
  }

  cancelRequests(): void {
    this._abortController.abort();
    this._abortController = new AbortController();
  }

  constructor(fetch: ApiFetch) {
    this._fetch = fetch;
  }

  async delete(path: string, options?: IApiClientFetchOptions): Promise<void> {
    const res = await this._fetch(path, {
      method: 'DELETE',
      signal: this.addAbortSignal(options),
    });

    assertOk(res);
  }

  async get<DataType>(
    path: string,
    options?: IApiClientFetchOptions
  ): Promise<DataType> {
    const res = await this._fetch(path, {
      signal: this.addAbortSignal(options),
    });
    const body = await res.json();

    assertOk(res);

    return body.data;
  }

  async patch<DataType, InputType = Partial<DataType>>(
    path: string,
    data: InputType,
    options?: IApiClientFetchOptions
  ): Promise<DataType> {
    const res = await this._fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      signal: this.addAbortSignal(options),
    });

    assertOk(res);

    const body = await res.json();
    return body.data;
  }

  async post<DataType, InputType = DataType>(
    path: string,
    data: Partial<InputType>,
    options?: IApiClientFetchOptions
  ): Promise<DataType> {
    const res = await this._fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: this.addAbortSignal(options),
    });

    assertOk(res);

    const body = await res.json();
    return body.data;
  }

  async put<DataType = void>(
    path: string,
    data?: Partial<DataType> | undefined,
    options?: IApiClientFetchOptions
  ): Promise<DataType> {
    const reqOptions: RequestInit = {
      method: 'PUT',
      signal: this.addAbortSignal(options),
    };

    if (data) {
      reqOptions.body = JSON.stringify(data);
      reqOptions.headers = {
        'Content-Type': 'application/json',
      };
    }

    const res = await this._fetch(path, reqOptions);

    assertOk(res);

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
    params: ParamsType,
    options?: IApiClientFetchOptions
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
      signal: this.addAbortSignal(options),
    });

    const body = (await res.json()) as RPCResponseBody<ResultType>;

    return body.result;
  }
}
