import { BlockToolConstructorOptions } from '@editorjs/editorjs';
import { createRoot } from 'react-dom/client';

import ButtonEditableBlock from './ButtonEditableBlock';
import { EmailFrame } from 'features/emails/types';
import Providers from 'core/Providers';

export interface ButtonData {
  url: string;
  buttonText: string;
  attributes: EmailFrame['blockAttributes']['button'];
}

export default class Button {
  private _config: { attributes: EmailFrame['blockAttributes']['button'] };
  private _data: ButtonData;
  private _readOnly: boolean;

  constructor({
    config,
    data,
    readOnly,
  }: BlockToolConstructorOptions<ButtonData>) {
    this._readOnly = readOnly;
    this._data = data;
    this._config = config;
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(
      <Providers {...window.providerData}>
        <ButtonEditableBlock
          attributes={this._config.attributes}
          data={this._data}
          onChange={(newButtonText: string) => {
            this._data = {
              ...this._data,
              buttonText: newButtonText,
            };
          }}
          readOnly={this._readOnly}
        />
      </Providers>
    );

    return container;
  }

  save() {
    // TODO: Return updated state
    return this._data;
  }

  static get toolbox() {
    return {
      icon: '<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 24 24" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><g id="Untitled"><path d="M10 12.5L7.5 12.5C5.567 12.5 4 10.933 4 9L4 9C4 7.067 5.567 5.5 7.5 5.5L16 5.5C17.6569 5.5 19 6.84315 19 8.5L19 8.5" fill="none" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="miter" stroke-width="2"/><path d="M20 14.886L16.623 11.8546L14 9.5L14 17.8333L15.7143 16.4298L17 18.5L19 17.5L18 15.307L20 14.886Z" fill="none" opacity="1" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="2"/></g></svg>',
      // TODO: Internationalize this
      title: 'Button',
    };
  }
}
