import { BlockToolConstructorOptions } from '@editorjs/editorjs';
import { createRoot } from 'react-dom/client';
import { LibraryImageData } from './types';
import LibraryImageEditableBlock from './LibraryImageEditableBlock';

export default class LibraryImage {
  private _data: LibraryImageData;

  constructor({ data }: BlockToolConstructorOptions<LibraryImageData>) {
    this._data = data;
  }

  static get isReadOnlySupported() {
    return false;
  }

  render() {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(<LibraryImageEditableBlock data={this._data} />);

    return container;
  }

  save() {
    // TODO: Return updated state
    return this._data;
  }

  static get toolbox() {
    return {
      // SVG icon from MUI
      icon: '<svg><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/></svg>',
      // TODO: Internationalize this
      title: 'Image',
    };
  }
}
