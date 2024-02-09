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
        first_name: 'First name',
        full_name: 'Full name',
        last_name: 'Last name',
      };

      this._button = document.createElement('button');
      this._button.type = 'button';
      this._button.innerHTML = 'VAR';
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
          'data-slug': true,
          style: true,
        },
      };
    }

    surround(range: Range): void {
      this._pendingRange = range;
      this._list.style.display = 'block';
    }

    static get title(): string {
      return title;
    }
  }

  return VariableTool;
}
