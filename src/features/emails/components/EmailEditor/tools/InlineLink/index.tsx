import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

import formatUrl from '../../EmailSettings/utils/formatUrl';
import getAnchorTags from './utils/getAnchorTags';
import InlineToolBase from '../../utils/InlineToolBase';

interface LinkToolConfig {
  messages: {
    addUrl: string;
    invalidUrl: string;
    testLink: string;
  };
  theme: {
    body2FontSize: string;
    mediumGray: string;
    primaryColor: string;
    warningColor: string;
  };
}

export function linkToolFactory(title: string) {
  class LinkTool extends InlineToolBase implements InlineTool {
    private _api: API;
    private _button: HTMLButtonElement | null;
    private _config: LinkToolConfig;
    private _container: HTMLDivElement | null;
    private _focused: boolean;
    private _input: HTMLInputElement | null;
    private _inputStatusContainer: HTMLDivElement | null;
    private _inputStatusMessage: HTMLDivElement | null;
    private _selectedAnchor: HTMLAnchorElement | null;
    private _visitLink: HTMLAnchorElement | null;

    constructor({ api, config }: InlineToolConstructorOptions) {
      super();
      this._api = api;
      this._button = null;
      this._config = config;
      this._container = null;
      this._input = null;
      this._inputStatusContainer = null;
      this._inputStatusMessage = null;
      this._visitLink = null;
      this._selectedAnchor = null;
      this._focused = false;
    }

    deactivate(): void {
      this.updateButton(false);
      if (this._container) {
        this._container.style.display = 'none';
      }
    }

    onToolClose(): void {
      //If the input is empty, remove anchor tag
      if (this._input && this._input.value.length === 0) {
        if (this._selectedAnchor) {
          this._selectedAnchor.replaceWith(
            ...Array.from(this._selectedAnchor.childNodes)
          );
        }
      }
    }

    renderActions() {
      this._input = document.createElement('input');
      this._input.style.padding = '8px';
      this._input.style.border = `1px solid ${this._config.theme.mediumGray}`;
      this._input.style.borderRadius = '4px';

      this._input.oninput = () => {
        if (this._selectedAnchor && this._input) {
          this._selectedAnchor.href = this._input.value;

          const formattedUrl = formatUrl(this._input.value);
          if (!formattedUrl) {
            this._selectedAnchor.classList.add('hasInvalidUrl');
          } else {
            this._selectedAnchor.classList.remove('hasInvalidUrl');
            this._selectedAnchor.href = formattedUrl;
          }
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

      this._inputStatusMessage = document.createElement('div');
      this._inputStatusMessage.textContent = this._config.messages.addUrl;
      this._inputStatusMessage.style.display = 'none';
      this._inputStatusMessage.style.fontSize =
        this._config.theme.body2FontSize;
      this._inputStatusMessage.style.paddingTop = '8px';

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
      svg.style.display = 'block';
      svg.style.height = '1.25rem';
      svg.style.width = 'auto';
      svg.style.marginRight = '8px';

      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path.setAttributeNS(
        null,
        'd',
        'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'
      );
      path.setAttributeNS(null, 'stroke-width', '0');
      path.setAttributeNS(null, 'fill', this._config.theme.mediumGray);
      svg.appendChild(path);

      const linkText = document.createElement('span');
      linkText.textContent = this._config.messages.testLink;
      linkText.style.fontSize = this._config.theme.body2FontSize;

      const visitLinkContainer = document.createElement('div');
      visitLinkContainer.style.display = 'flex';
      visitLinkContainer.style.flexDirection = 'row';
      visitLinkContainer.style.paddingTop = '8px';
      visitLinkContainer.style.alignItems = 'center';
      visitLinkContainer.appendChild(svg);
      visitLinkContainer.appendChild(linkText);

      this._visitLink = document.createElement('a');
      this._visitLink.target = '_blank';
      this._visitLink.style.textDecoration = 'none';
      this._visitLink.style.color = 'inherit';
      this._visitLink.appendChild(visitLinkContainer);

      this._inputStatusContainer = document.createElement('div');
      this._inputStatusContainer.appendChild(this._visitLink);
      this._inputStatusContainer.appendChild(this._inputStatusMessage);

      this._container = document.createElement('div');
      this._container.style.padding = '8px';

      this._container.appendChild(this._input);
      this._container.appendChild(this._inputStatusContainer);

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
          class: true,
          href: true,
          target: '_blank',
        },
      };
    }

    get shortcut() {
      return 'CMD+K';
    }

    surround(range: Range) {
      this.activate();
      const anchors = getAnchorTags(range);
      if (anchors.length) {
        anchors.forEach((anchor) => {
          anchor.replaceWith(...Array.from(anchor.childNodes));
        });
      } else {
        const anchor = document.createElement('a');
        anchor.classList.add('inlineLink');
        anchor.style.cursor = 'text';

        const content = range.extractContents();
        anchor.append(content);

        range.insertNode(anchor);
        this._api.selection.expandToTag(anchor);
      }

      const newRange =
        window.getSelection()?.getRangeAt(0) || document.createRange();
      this.update(newRange);
    }

    static get title() {
      return title;
    }

    update(range: Range) {
      if (
        this._container &&
        this._input &&
        this._button &&
        this._inputStatusMessage &&
        this._visitLink
      ) {
        const anchors = getAnchorTags(range);

        if (anchors.length == 1) {
          this._selectedAnchor = anchors[0];
          this._container.style.display = 'block';
          this._input.value = this._selectedAnchor.getAttribute('href') || '';

          if (this._input.value.length === 0) {
            this._input.focus();
          }
        } else if (!this._focused) {
          this._container.style.display = 'none';
          this._selectedAnchor = null;
        }

        const formattedUrl = formatUrl(this._input.value);

        const noUrl = this._input.value.length === 0;
        const error = this._input.value.length > 0 && !formattedUrl;

        //show either status message or this._link
        if (noUrl || error) {
          this._visitLink.style.display = 'none';
          this._inputStatusMessage.style.display = 'block';

          this._inputStatusMessage.style.color = noUrl
            ? this._config.theme.warningColor
            : this._config.theme.primaryColor;
          this._inputStatusMessage.textContent = noUrl
            ? this._config.messages.addUrl
            : this._config.messages.invalidUrl;
        } else {
          if (formattedUrl) {
            this._visitLink.href = formattedUrl;
          }
          this._inputStatusMessage.style.display = 'none';
          this._visitLink.style.display = 'block';
        }

        //switch between icons for adding and removing this._link
        this.updateButton(!this._selectedAnchor && anchors.length == 0);
      }
    }

    private updateButton(showPlainLinkIcon: boolean): void {
      if (this._button) {
        this._button.innerHTML = showPlainLinkIcon
          ? '<svg width="24" height="24" viewBox="0 0 24 24"><path stroke-width="0" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5"/></svg>'
          : '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" stroke-width="0" class="ce-inline-tool--active" d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5m-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3z"/></svg>';
      }
    }
  }

  return LinkTool;
}
