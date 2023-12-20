/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import Button from 'editorjs-button';
import { Dialog } from '@mui/material';
import Header from '@editorjs/header';
//@ts-ignore
import ImageTool from '@editorjs/image';
import EditorJS, {
  EditorConfig,
  OutputData,
  ToolConstructable,
} from '@editorjs/editorjs';
import { FC, useEffect, useRef, useState } from 'react';

interface EditorProps {
  onSave: (data: OutputData) => void;
}

const Editor: FC<EditorProps> = ({ onSave }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const editorInstance = useRef<EditorJS | null>(null);

  const saved = async () => {
    try {
      const savedData = await editorInstance.current?.save();
      if (savedData) {
        onSave(savedData);
      }
    } catch (error) {
      //TODO: handle error
    }
  };

  useEffect(() => {
    // Define the EditorJS configuration
    const editorConfig: EditorConfig = {
      holder: 'editorjs',
      inlineToolbar: ['bold', 'link', 'italic'],
      onChange: () => {
        saved();
      },
      sanitizer: {
        b: false,
      },
      tools: {
        button: {
          class: Button,
          config: {},
          inlineToolbar: false,
        },
        header: {
          class: Header as unknown as ToolConstructable,
          config: {
            placeholder: 'Header',
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadSelectedFile: () => {
                //testar för att se om denna funktion tillåter att man gör sin egen
                //logik för filurval. Verkar inte så.
                setDialogOpen(true);
              },
            },
          },
        },
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

  return (
    <>
      <div
        id="editorjs"
        style={{ backgroundColor: 'white', border: '1px solid black' }}
      />
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        Hej
      </Dialog>
    </>
  );
};

export default Editor;
