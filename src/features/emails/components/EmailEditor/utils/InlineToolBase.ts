export default class InlineToolBase {
  private static _activeInstance: InlineToolBase | null = null;

  activate() {
    if (InlineToolBase._activeInstance) {
      InlineToolBase._activeInstance.deactivate();
    }
    InlineToolBase._activeInstance = this;
  }

  checkState(selection: Selection) {
    this.update(selection.getRangeAt(0));
    return true;
  }

  clear() {
    this.onToolClose();
  }

  deactivate() {
    // Called by activate()
  }

  static get isInline() {
    return true;
  }

  onToolClose() {
    //Overridden in tool
  }

  render() {
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
