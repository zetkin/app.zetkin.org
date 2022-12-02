import IApiClient from './IApiClient';

export default class BrowserApiClient implements IApiClient {
  async get<DataType>(path: string): Promise<DataType> {
    const res = await fetch(path);
    const body = await res.json();
    return body.data;
  }

  async patch<DataType>(
    path: string,
    data: Partial<DataType>
  ): Promise<DataType> {
    const res = await fetch(path, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
    const body = await res.json();
    return body.data;
  }
}
