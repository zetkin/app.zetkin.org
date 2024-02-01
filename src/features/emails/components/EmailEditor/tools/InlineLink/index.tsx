import getAnchorTags from './utils/getAnchorTags';
import InlineToolBase from '../../utils/InlineToolBase';
import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

export default class LinkTool extends InlineToolBase implements InlineTool {
  private _api: API;
  private _button: HTMLButtonElement | null;
  private _input: HTMLInputElement | null;

  constructor({ api }: InlineToolConstructorOptions) {
    super();
    this._api = api;
    this._button = null;
    this._input = null;
  }

  removeLink(range: Range) {
    const anchors = getAnchorTags(range, this._api);

    anchors.forEach((anchor) => {
      anchor.childNodes.forEach((child) =>
        anchor.parentNode?.appendChild(child)
      );
      anchor.parentNode?.removeChild(anchor);
    });
  }

  renderActions() {
    this._input = document.createElement('input');
    this._input.style.margin = '10px';
    this._input.hidden = true;

    return this._input;
  }

  renderButton() {
    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.textContent = 'Link';
    this._button.classList.add(this._api.styles.inlineToolButton);
    return this._button;
  }

  static get sanitize() {
    return {
      a: {
        class: 'inlineLink',
      },
    };
  }

  surround() {
    // TODO: Either remove link(s) or add link, depending on selection
  }

  update() {
    // TODO: Toggle button and actions
  }
}
