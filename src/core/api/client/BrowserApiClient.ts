import IApiClient from './IApiClient';

export default class BrowserApiClient implements IApiClient {
  async get<DataType>(path: string): Promise<DataType> {
    const res = await fetch(path);
    return await res.json();
  }
}
