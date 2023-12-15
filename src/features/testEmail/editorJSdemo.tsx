import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData, EditorConfig } from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import NestedList from '@editorjs/nested-list';
// @ts-ignore
import Embed from '@editorjs/embed';
// @ts-ignore
import Table from '@editorjs/table';
// import List from '@editorjs/list'
// @ts-ignore
import Warning from '@editorjs/warning';
// @ts-ignore
import Code from '@editorjs/code';
// @ts-ignore
import LinkTool from '@editorjs/link';
// import Image from '@editorjs/image';
// @ts-ignore
import Raw from '@editorjs/raw';
// @ts-ignore
import Quote from '@editorjs/quote';
// @ts-ignore
import Marker from '@editorjs/marker';
// @ts-ignore
import CheckList from '@editorjs/checklist';
// @ts-ignore
import Delimiter from '@editorjs/delimiter';
// @ts-ignore
import InlineCode from '@editorjs/inline-code';
// @ts-ignore
import SimpleImage from '@editorjs/simple-image';
// @ts-ignore
import Paragraph from '@editorjs/paragraph';
const AnyButton = require('editorjs-button');
export const ssr = false;

interface EditorProps {
  onSave: (data: OutputData) => void;
}

const TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ['alignmentTuneTool'],
  },
  header: {
    class: Header,
    inlineToolbar: ['link', 'marker', 'color', 'fontFamily'],
    config: {
      placeholder: 'Header',
    },
    shortcut: 'CMD+SHIFT+H',
  },
  image: {
    class: SimpleImage,

    inlineToolbar: true,
    tunes: ['alignmentTuneTool'],
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      placeholder: 'List',
    },
    shortcut: 'CMD+SHIFT+L',
    tunes: ['alignmentTuneTool'],
  },
  quote: Quote,
  warning: {
    class: Warning,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+W',
    tunes: ['alignmentTuneTool'],
  },
  checkList: CheckList,
  marker: {
    class: Marker, // if load from CDN, please try: window.ColorPlugin
    config: {
      type: 'marker',
    },
  },
  code: {
    class: Code,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+C',
  },
  delimiter: Delimiter,
  inlineCode: InlineCode,
  linkTool: LinkTool,
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        youtube: true,
        soundcloud: true,
        twitter: true,
      },
    },
    shortcut: 'CMD+SHIFT+E',
    tunes: ['alignmentTuneTool'],
  },
  table: {
    class: Table,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+T',
    tunes: ['alignmentTuneTool'],
  },

  // style: EditorJSStyle.StyleInlineTool,
  raw: Raw,
};

const Editor: React.FC<EditorProps> = ({ onSave }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    // Define the tools configuration (replace with your actual tools)
    const tools = TOOLS;

    // Define the EditorJS configuration
    const editorConfig: EditorConfig = {
      holder: 'editorjs',
      tools,
      inlineToolbar: ['link', 'marker', 'bold', 'italic'],
      onReady: () => {
        console.log('Editor.js is ready to work!');
      },
      onChange: (api, event) => {
        console.log("Now I know that Editor's content changed!", event);
        saved();
      },
    };

    // Create the EditorJS instance
    editorInstance.current = new EditorJS(editorConfig);

    return () => {
      // Cleanup when the component is unmounted
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
    };
  }, []);

  const saved = async () => {
    try {
      const savedData = await editorInstance.current?.save();
      if (savedData) {
        console.log('Saved:', savedData);
        onSave(savedData);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <div id="editorjs" style={{ backgroundColor: 'white', margin: '8px' }} />
  );
};

// Example usage
const MyEditorComponent: React.FC = () => {
  const handleSave = (data: OutputData) => {
    // Handle the saved data, you can send it to your server or perform other actions
    console.log('Handling saved data:', data);
  };

  return <Editor onSave={handleSave} />;
};

export default MyEditorComponent;
