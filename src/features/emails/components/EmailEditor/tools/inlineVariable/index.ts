import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

import InlineToolBase from '../../utils/InlineToolBase';

export default function variableToolFactory(title: string) {
  class VariableTool extends InlineToolBase implements InlineTool {
    private _api: API;
    private _availableVars: { [slug: string]: string };
    private _button: HTMLButtonElement;
    private _list: HTMLUListElement;
    private _pendingRange: Range | null = null;

    constructor({ api }: InlineToolConstructorOptions) {
      super();

      this._api = api;

      this._availableVars = {
        'target.first_name': 'First name',
        'target.full_name': 'Full name',
        'target.last_name': 'Last name',
      };

      this._button = document.createElement('button');
      this._button.type = 'button';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
      svg.style.display = 'block';
      svg.style.padding = '2px';
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path.setAttributeNS(
        null,
        'd',
        'M4 7v2c0 .55-.45 1-1 1H2v4h1c.55 0 1 .45 1 1v2c0 1.65 1.35 3 3 3h3v-2H7c-.55 0-1-.45-1-1v-2c0-1.3-.84-2.42-2-2.83v-.34C5.16 11.42 6 10.3 6 9V7c0-.55.45-1 1-1h3V4H7C5.35 4 4 5.35 4 7m17 3c-.55 0-1-.45-1-1V7c0-1.65-1.35-3-3-3h-3v2h3c.55 0 1 .45 1 1v2c0 1.3.84 2.42 2 2.83v.34c-1.16.41-2 1.52-2 2.83v2c0 .55-.45 1-1 1h-3v2h3c1.65 0 3-1.35 3-3v-2c0-.55.45-1 1-1h1v-4z'
      );
      path.setAttributeNS(null, 'stroke-width', '0');
      svg.appendChild(path);
      this._button.appendChild(svg);
      this._button.classList.add(this._api.styles.inlineToolButton);

      this._list = document.createElement('ul');
      this._list.style.display = 'none';
      this._list.style.listStyleType = 'none';
      this._list.style.minWidth = '150px';
      this._list.style.padding = '0px';
      this._list.style.margin = '0px';

      Object.entries(this._availableVars).forEach(([slug, title]) => {
        const item = document.createElement('li');
        item.style.cursor = 'pointer';
        item.style.padding = '8px';
        item.style.borderTop = '1px solid rgba(0,0,0,0.1)';
        item.addEventListener('mouseenter', () => {
          item.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });
        item.addEventListener('mouseleave', () => {
          item.style.backgroundColor = 'transparent';
        });

        item.dataset.slug = slug;
        item.innerText = title;
        item.addEventListener(
          'click',
          (ev) => {
            ev.stopImmediatePropagation();
            if (this._pendingRange) {
              this.insertVariable(this._pendingRange, slug);
            }
          },
          { capture: true }
        );

        this._list.append(item);
      });
    }

    deactivate(): void {
      this._list.style.display = 'none';
    }

    insertVariable(range: Range, slug: string): void {
      const elem = document.createElement('span');
      elem.contentEditable = 'false';
      elem.style.backgroundColor = 'rgba(0,0,0,0.1)';
      elem.style.padding = '0.1em 0.5em';
      elem.style.borderRadius = '1em';
      elem.style.display = 'inline-block';
      elem.textContent = this._availableVars[slug];
      range.deleteContents();
      range.insertNode(elem);

      // Store slug in dataset
      elem.dataset.slug = slug;

      // Reset editor
      this._api.toolbar.close();
      window.getSelection()?.empty();
    }

    renderActions(): HTMLElement {
      return this._list;
    }

    protected renderButton() {
      return this._button;
    }

    static get sanitize() {
      return {
        span: {
          contenteditable: true,
          'data-slug': true,
          style: true,
        },
      };
    }

    surround(range: Range): void {
      this.activate();
      this._pendingRange = range;
      this._list.style.display = 'block';
    }

    static get title(): string {
      return title;
    }
  }

  return VariableTool;
}
