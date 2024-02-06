import EditorJS, {
  EditorConfig,
  OutputData,
  ToolConstructable,
} from '@editorjs/editorjs';
import { FC, MutableRefObject, useEffect, useRef } from 'react';

import Button from './tools/Button';
import InlineLink from './tools/InlineLink';
import LibraryImage from './tools/LibraryImage';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';

export type EmailEditorFrontendProps = {
  apiRef: MutableRefObject<EditorJS | null>;
  initialContent: OutputData;
  onChange: (data: OutputData) => void;
  onSave: (data: OutputData) => void;
  onSelectBlock: (selectedBlockIndex: number) => void;
};

const EmailEditorFrontend: FC<EmailEditorFrontendProps> = ({
  apiRef,
  initialContent,
  onChange,
  onSave,
  onSelectBlock,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const editorInstance = useRef<EditorJS | null>(null);
  const blockIndexRef = useRef<number | null>(null);

  const saved = async () => {
    try {
      const savedData = await editorInstance.current?.save();
      if (savedData && onSave) {
        onChange(savedData);
        onSave(savedData);
      }
    } catch (error) {
      //TODO: handle error
    }
  };

  useEffect(() => {
    const editorConfig: EditorConfig = {
      data: initialContent,
      // TODO: Find way to make unique IDs
      holder: 'ClientOnlyEditor-container',
      inlineToolbar: ['bold', 'italic', 'link'],
      onChange: () => {
        saved();
      },
      tools: {
        button: {
          class: Button as unknown as ToolConstructable,
        },
        libraryImage: {
          class: LibraryImage as unknown as ToolConstructable,
          config: {
            orgId,
          },
        },
        link: {
          class: InlineLink as unknown as ToolConstructable,
          config: {
            messages: {
              addUrl: messages.tools.link.addUrl(),
              invalidUrl: messages.tools.link.invalidUrl(),
              testLink: messages.tools.link.testLink(),
            },
          },
        },
      },
    };

    // Create the EditorJS instance
    editorInstance.current = new EditorJS(editorConfig);

    const setEditorJSApiRef = async () => {
      await editorInstance.current?.isReady;
      apiRef.current = editorInstance.current;
    };

    setEditorJSApiRef();

    return () => {
      // Cleanup when the component is unmounted
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
        } catch (error) {
          //TODO: handle error
        }
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      await editorInstance.current?.isReady;

      const currentBlockIndex =
        editorInstance.current?.blocks.getCurrentBlockIndex();
      if (
        typeof currentBlockIndex == 'number' &&
        currentBlockIndex >= 0 &&
        currentBlockIndex !== blockIndexRef.current
      ) {
        blockIndexRef.current = currentBlockIndex;
        onSelectBlock(currentBlockIndex);
      }
    }, 200);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      id="ClientOnlyEditor-container"
      style={{ backgroundColor: 'white', border: '1px solid black' }}
    />
  );
};

export default EmailEditorFrontend;
