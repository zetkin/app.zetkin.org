export class ApiClientError extends Error {
  private _description?: string;
  private _status: number;
  private _title?: string;
  private _url: string;

  constructor(
    status: number,
    url: string,
    title?: string,
    description?: string
  ) {
    super(`Error during request: ${status}, ${url}`);
    this._status = status;
    this._url = url;
    this._title = title;
    this._description = description;
  }

  public get errorDescription(): string | undefined {
    return this._description;
  }

  public get errorTitle(): string | undefined {
    return this._title;
  }

  static async fromResponse(res: Response) {
    let title: string | undefined;
    let description: string | undefined;

    try {
      const data = await res.json();
      title = data?.error?.title;
      description = data?.error?.description;
    } catch (_e) {
      // Ignore and return as usual
    }

    return new ApiClientError(res.status, res.url, title, description);
  }

  public get status(): number {
    return this._status;
  }

  public get url(): string {
    return this._url;
  }
}
