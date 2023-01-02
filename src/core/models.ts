export interface IModel {
  subscribe: (handler: () => void) => () => void;
}

export class ModelBase implements IModel {
  private _handlers: Array<() => void> = [];

  protected emitChange() {
    for (const handler of this._handlers) {
      handler();
    }
  }

  subscribe(newHandler: () => void) {
    this._handlers.push(newHandler);

    return () => {
      this._handlers = this._handlers.filter(
        (handler) => handler != newHandler
      );
    };
  }
}
