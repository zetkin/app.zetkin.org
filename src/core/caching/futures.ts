import { RemoteItem, RemoteList } from 'utils/storeUtils';

export interface IFuture<DataType> {
  data: DataType | null;
  error: unknown | null;
  isLoading: boolean;
}

export function futureToObject<DataType>(future: IFuture<DataType>) {
  return {
    data: future.data,
    error: future.error,
    isLoading: future.isLoading,
  };
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
    this._isLoading = true;

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

export class LoadingFuture<DataType>
  extends FutureBase<DataType>
  implements IFuture<DataType>
{
  constructor() {
    super(null, null, true);
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

export class RemoteItemFuture<DataType>
  extends FutureBase<DataType>
  implements IFuture<DataType>
{
  constructor(item: RemoteItem<DataType>) {
    super(item.data, item.error, item.isLoading);
  }
}

export class RemoteListFuture<DataType>
  extends FutureBase<DataType[]>
  implements IFuture<DataType[]>
{
  constructor(list: RemoteList<DataType>) {
    super(
      list.items
        .filter((item) => item.data != null)
        .map((item) => item.data) as DataType[],
      list.error,
      list.isLoading
    );
  }
}

export class ErrorFuture<DataType>
  extends FutureBase<DataType>
  implements IFuture<DataType>
{
  constructor(error: unknown) {
    super(null, error, false);
  }
}
