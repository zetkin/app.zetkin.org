export class ApiClientError extends Error {
  private _status: number;
  private _url: string;

  constructor(status: number, url: string) {
    super(`Error during request: ${status}, ${url}`);
    this._status = status;
    this._url = url;
  }

  static fromResponse(res: Response) {
    return new ApiClientError(res.status, res.url);
  }

  public get status(): number {
    return this._status;
  }

  public get url(): string {
    return this._url;
  }
}
