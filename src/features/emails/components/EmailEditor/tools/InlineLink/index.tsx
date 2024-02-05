import formatUrl from '../Button/utils/formatUrl';
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
  private _container: HTMLDivElement | null;
  private _errorMessage: HTMLDivElement | null;
  private _focused: boolean;
  private _formattedUrl: string;
  private _input: HTMLInputElement | null;
  private _selectedAnchor: HTMLAnchorElement | null;

  constructor({ api }: InlineToolConstructorOptions) {
    super();
    this._api = api;
    this._button = null;
    this._container = null;
    this._errorMessage = null;
    this._formattedUrl = '';
    this._input = null;
    this._selectedAnchor = null;
    this._focused = false;
  }

  renderActions() {
    this._container = document.createElement('div');

    this._input = document.createElement('input');
    this._input.style.margin = '10px';
    this._input.oninput = () => {
      if (this._selectedAnchor && this._input) {
        this._formattedUrl = formatUrl(this._input.value);
        this._selectedAnchor.href = this._formattedUrl;
      }
    };
    this._input.onfocus = () => {
      this._focused = true;
    };
    this._input.onblur = () => {
      this._focused = false;
      this.clear();
    };
    this._input.onkeyup = (ev) => {
      if (ev.code == 'Enter' || ev.code == 'NumpadEnter') {
        this._focused = false;
        this._api.inlineToolbar.close();
        this.clear();
      }
    };

    this._errorMessage = document.createElement('div');
    this._errorMessage.textContent = 'This is not a valid url';

    this._container.appendChild(this._input);
    this._container.appendChild(this._errorMessage);

    return this._container;
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

  surround(range: Range) {
    const anchors = getAnchorTags(range);
    if (anchors.length) {
      anchors.forEach((anchor) => {
        anchor.replaceWith(...Array.from(anchor.childNodes));
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('inlineLink');

      const content = range.extractContents();
      anchor.append(content);

      range.insertNode(anchor);
      this._api.selection.expandToTag(anchor);
    }

    const newRange =
      window.getSelection()?.getRangeAt(0) || document.createRange();
    this.update(newRange);
  }

  update(range: Range) {
    if (this._container && this._input && this._button && this._errorMessage) {
      const anchors = getAnchorTags(range);
      const error =
        this._input.value.length > 0 && this._formattedUrl.length == 0;

      if (anchors.length == 1) {
        this._selectedAnchor = anchors[0];
        this._container.style.display = 'block';
        this._input.value = this._selectedAnchor.href;
      } else if (!this._focused) {
        this._container.style.display = 'none';
        this._selectedAnchor = null;
      }

      this._errorMessage.style.color = error ? 'red' : 'transparent';
      this._button.textContent =
        !this._selectedAnchor && anchors.length == 0 ? 'Link' : 'Unlink';
    }
  }
}
