export default class LinkTool {
  private _button: HTMLButtonElement | null;
  private _hasLink: boolean;

  checkState(selection: any) {
    const text = selection.anchorNode;

    if (!text) {
      return;
    }

    const anchorElement = text instanceof Element ? text : text.parentElement;
    this._hasLink = !!anchorElement.closest('a');
  }

  constructor() {
    this._button = null;
    this._hasLink = false;
  }

  static get isInline() {
    return true;
  }

  render() {
    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.textContent = 'Link';

    return this._button;
  }

  surround(range: any) {
    if (this._hasLink) {
      return;
    }

    const selectedText = range.extractContents();

    const anchor = document.createElement('a');
    anchor.appendChild(selectedText);

    range.insertNode(anchor);
  }
}
