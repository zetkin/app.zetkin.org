import React, { useRef } from 'react';
import { render } from 'react-dom';

import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import sample from './reactEditorSample.json';
import JSONTemplate from 'react-email-editor';

const ReactEmailEditor = () => {
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
    });
  };

  function loadTemplate() {
    console.log('dentro de loadTemplate');
    unlayer.loadDesign({
      counters: { template: 1 },
      body: {
        id: '1',
        rows: [
          {
            id: '1',
            cells: [3],
            columns: [{ id: '3', contents: [], values: {} }],
            values: {},
          },
        ],
        headers: [
          {
            id: '1',
            cells: [3],
            columns: [{ id: '3', contents: [], values: {} }],
            values: {},
          },
        ],
        footers: [
          {
            id: '1',
            cells: [3],
            columns: [{ id: '3', contents: [], values: {} }],
            values: {},
          },
        ],
        values: {},
      },
    });
  }
  const onDesignLoad = (data: any) => {
    console.log('onDesignLoad', data);
  };

  const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
    console.log('onLoad', unlayer);
    unlayer.addEventListener('design:loaded', onDesignLoad);
    // unlayer.loadTemplate(sample);
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    console.log('aqui');

    unlayer.init({
      id: 'editor-container',
      displayMode: 'email',
      customJS: [
        'C:/Users/Rebe/testapp.zetkin.orgsrc/features/testEmail/custom.js',
      ],
      appearance: {
        features: { preview: true },
        theme: 'light',
        panels: {
          tools: {
            dock: 'left',
            collapsible: true,
            tabs: {
              body: {
                visible: true,
              },
            },
          },
        },
      },
    });
  };

  return (
    <div>
      <div>
        <button onClick={loadTemplate}>Export HTML</button>
      </div>

      <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
    </div>
  );
};

export default ReactEmailEditor;
