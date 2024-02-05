import formatUrl from '../Button/utils/formatUrl';
import getAnchorTags from './utils/getAnchorTags';
import InlineToolBase from '../../utils/InlineToolBase';
import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

interface LinkToolConfig {
  messages: {
    invalidUrl: string;
  };
}

export default class LinkTool extends InlineToolBase implements InlineTool {
  private _api: API;
  private _button: HTMLButtonElement | null;
  private _config: LinkToolConfig;
  private _container: HTMLDivElement | null;
  private _errorMessage: HTMLDivElement | null;
  private _focused: boolean;
  private _formattedUrl: string;
  private _input: HTMLInputElement | null;
  private _selectedAnchor: HTMLAnchorElement | null;

  constructor({ api, config }: InlineToolConstructorOptions) {
    super();
    this._api = api;
    this._button = null;
    this._config = config;
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
    this._errorMessage.textContent = this._config.messages.invalidUrl;

    this._container.appendChild(this._input);
    this._container.appendChild(this._errorMessage);

    return this._container;
  }

  renderButton() {
    this._button = document.createElement('button');
    this._button.type = 'button';
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

      //switch between icons for adding and removing link
      this._button.innerHTML =
        !this._selectedAnchor && anchors.length == 0
          ? '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5"/></svg>'
          : '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5m-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3z"/></svg>';
    }
  }
}
