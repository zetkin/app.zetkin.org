import { BlockToolConstructorOptions } from '@editorjs/editorjs';
import { Box } from '@mui/material';
import { createRoot, Root } from 'react-dom/client';

import { SignatureData } from 'features/emails/types';

export default class Signature {
  private _data: SignatureData;
  private _placeholder: string;
  private _root?: Root;

  constructor({
    config,
    data,
  }: Partial<BlockToolConstructorOptions<SignatureData>>) {
    this._data = {
      email: data?.email || '',
      name: data?.name || '',
      phone: data?.phone || '',
    };
    this._placeholder = config?.placeholder || '';
  }

  destroy() {
    this._root?.unmount();
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    const container = document.createElement('div');
    this._root = createRoot(container);
    this._root.render(
      <Box sx={{ fontSize: '12px', lineHeight: '16px', py: '10px' }}>
        <Box component="strong">{this._data.name || this._placeholder}</Box>
        {this._data.email && <Box>{this._data.email}</Box>}
        {this._data.phone && <Box>{this._data.phone}</Box>}
      </Box>
    );
    return container;
  }

  save() {
    return this._data;
  }

  static get toolbox() {
    return {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h6M7 12h10M7 16h8"/></svg>',
    };
  }
}
