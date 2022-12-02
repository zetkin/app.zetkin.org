export interface IFuture<DataType> {
  data: DataType | null;
  error: unknown | null;
  isLoading: boolean;
}

export class FutureBase<DataType> {
  constructor(
    protected _data: DataType | null = null,
    protected _error: unknown | null = null,
    protected _isLoading: boolean = false
  ) {}

  get data(): DataType | null {
    return this._data;
  }

  get error(): unknown | null {
    return this._error;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
}

export class PromiseFuture<DataType>
  extends FutureBase<DataType>
  implements IFuture<DataType>
{
  private _promise: Promise<DataType>;

  constructor(promise: Promise<DataType>) {
    super();

    this._promise = promise;

    this._promise.then((res) => {
      this._data = res;
    });

    this._promise.catch((err) => {
      this._error = err;
    });

    this._promise.finally(() => {
      this._isLoading = false;
    });
  }
}

export class ResolvedFuture<DataType>
  extends FutureBase<DataType>
  implements IFuture<DataType>
{
  constructor(data: DataType) {
    super(data);
  }
}

export class PlaceholderFuture<DataType>
  extends FutureBase<DataType>
  implements IFuture<DataType>
{
  constructor(placeholder: DataType) {
    super(placeholder, null, true);
  }
}
