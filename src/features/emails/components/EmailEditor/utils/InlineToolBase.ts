export default class InlineToolBase {
  private static _activeInstance: InlineToolBase | null = null;

  private _handleSelectionChangeBound: () => void = () => undefined;

  activate() {
    if (InlineToolBase._activeInstance) {
      InlineToolBase._activeInstance.deactivate();
    }
    InlineToolBase._activeInstance = this;
  }

  checkState() {
    return true;
  }

  clear() {
    this.onToolClose();
    this.destroy();
  }

  deactivate() {
    // Called by activate()
  }

  destroy() {
    document.removeEventListener(
      'selectionchange',
      this._handleSelectionChangeBound
    );
  }

  static get isInline() {
    return true;
  }

  onToolClose() {
    //Overridden in tool
  }

  render() {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = window.getSelection()?.getRangeAt(0);
        if (range) {
          this.update(range);
        }
      }
    };

    this._handleSelectionChangeBound = handleSelectionChange.bind(this);
    document.addEventListener(
      'selectionchange',
      this._handleSelectionChangeBound
    );

    return this.renderButton();
  }

  protected renderButton(): HTMLElement {
    throw new Error('Method must be overridden');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected update(range: Range): void {
    // Does nothing by default
  }
}
