import { ApiFetch } from 'utils/apiFetch';
import IApiClient from './IApiClient';

export default class FetchApiClient implements IApiClient {
  private _fetch: ApiFetch;

  constructor(fetch: ApiFetch) {
    this._fetch = fetch;
  }

  async delete(path: string): Promise<void> {
    await this._fetch(path, {
      method: 'DELETE',
    });
  }

  async get<DataType>(path: string): Promise<DataType> {
    const res = await this._fetch(path);
    const body = await res.json();
    return body.data;
  }

  async patch<DataType>(
    path: string,
    data: Partial<DataType>
  ): Promise<DataType> {
    const res = await this._fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
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

    const body = await res.json();
    return body.data;
  }
}
