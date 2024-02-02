export default class InlineToolBase {
  private _handleSelectionChangeBound: () => void = () => undefined;

  checkState() {
    return true;
  }

  clear() {
    this.destroy();
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

  render() {
    const handleSelectionChange = () => {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        this.update(range);
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

  protected update(range: Range): void {
    throw new Error('Method must be overridden' + range.toString());
  }
}
