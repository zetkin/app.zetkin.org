import EditorJS from '@editorjs/editorjs';
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
import Image from '@editorjs/image';
// import Paragraph from 'editorjs-paragraph-with-alignment';
// @ts-ignore
import DragDrop from 'editorjs-drag-drop';

const AnyButton = require('editorjs-button');
import { Box } from '@mui/system';

// Define the inline tool class
class CustomInlineTool {
  private api: any;
  private readonly button: HTMLElement;

  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      // Define allowed HTML tags and attributes for this inline tool
    };
  }

  constructor({ api }: { api: any }) {
    this.api = api;

    // Create a button for the inline tool
    this.button = document.createElement('button');
    this.button.textContent = 'Custom Inline Tool';
    this.button.addEventListener('click', () => this.handleClick());
  }

  render() {
    return this.button;
  }

  handleClick() {
    // Handle the button click event
    const selectedText = this.api.selection?.getHTML() || '';
    console.log('Selected Text:', selectedText);
    // You can perform actions with the selected text here
  }
}

const TOOLS = {
  nestedList: NestedList,
  embed: Embed,
  table: Table,
  marker: Marker,
  list: NestedList,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: SimpleImage,
  raw: Raw,
  //   paragraph: Paragraph,
  header: {
    class: Header,
    inlineToolbar: ['link', 'marker', 'color', 'fontFamily'],
    config: {
      placeholder: 'Header',
    },
    shortcut: 'CMD+SHIFT+H',
  },
  AnyButton: {
    class: AnyButton,
    inlineToolbar: false,
    config: {
      css: {
        btnColor: 'btn--gray',
      },
    },
  },
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
};

let editor: any;

const initEditor = () => {
  editor = new EditorJS({
    holder: 'editorjs',
    inlineToolbar: ['customInlineTool', 'link', 'marker', 'bold', 'italic'],
    tools: TOOLS,
    onReady: () => {
      new DragDrop(editor);
      console.log('Editor.js is ready to work!');
    },
    onChange: (api, event) => {
      console.log("Now I know that Editor's content changed!", event);
      saved(editor);
    },
  });
};

function saved(editor: any) {
  editor
    .save()
    .then((savedData: any) => {
      console.log('salvado', savedData);
    })
    .catch((error: any) => {
      console.log('fallo al guardar', error);
    });
}

const EditorJsDemo = () => {
  initEditor();
  return <Box id="editorjs" sx={{ backgroundColor: 'white', margin: 8 }} />;
};

export default EditorJsDemo;
