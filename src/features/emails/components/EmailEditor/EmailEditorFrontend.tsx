/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import Paragraph from '@editorjs/paragraph';
import EditorJS, {
  EditorConfig,
  OutputData,
  ToolConstructable,
} from '@editorjs/editorjs';
import { FC, MutableRefObject, useEffect, useRef } from 'react';

import Button from './tools/Button';
import LibraryImage from './tools/LibraryImage';
import { linkToolFactory } from './tools/InlineLink';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { useTheme } from '@mui/material';
import variableToolFactory from './tools/inlineVariable';

export type EmailEditorFrontendProps = {
  apiRef: MutableRefObject<EditorJS | null>;
  initialContent: OutputData;
  onSave: (data: OutputData) => void;
  onSelectBlock: (selectedBlockIndex: number) => void;
};

const EmailEditorFrontend: FC<EmailEditorFrontendProps> = ({
  apiRef,
  initialContent,
  onSave,
  onSelectBlock,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const editorInstance = useRef<EditorJS | null>(null);
  const blockIndexRef = useRef<number | null>(null);

  const saveData = async () => {
    try {
      const savedData = await editorInstance.current?.save();
      if (savedData && onSave) {
        const filteredSavedData = {
          ...savedData,
          blocks: savedData.blocks.filter((block) => {
            if (block.type === 'libraryImage' && !block.data.fileId) {
              return false;
            }
            return true;
          }),
        };
        onSave(filteredSavedData);
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
      inlineToolbar: ['bold', 'italic', 'link', 'variable'],
      onChange: () => saveData(),
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
          class: linkToolFactory(messages.editor.tools.link.title()),
          config: {
            messages: {
              addUrl: messages.editor.tools.link.addUrl(),
              invalidUrl: messages.editor.tools.link.invalidUrl(),
              testLink: messages.editor.tools.link.testLink(),
            },
            theme: {
              body2FontSize: theme.typography.body2.fontSize,
              mediumGray: theme.palette.grey[600],
              primaryColor: theme.palette.primary.main,
              warningColor: theme.palette.warning.main,
            },
          },
        },
        paragraph: {
          class: Paragraph,
          config: {
            preserveBlank: true,
          },
        },
        variable: {
          class: variableToolFactory('Variable'),
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
    <div id="ClientOnlyEditor-container" style={{ backgroundColor: 'white' }} />
  );
};

export default EmailEditorFrontend;