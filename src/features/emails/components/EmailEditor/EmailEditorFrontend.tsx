/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import Header from '@editorjs/header';
import { Box, useTheme } from '@mui/material';
import EditorJS, {
  EditorConfig,
  OutputData,
  ToolConstructable,
} from '@editorjs/editorjs';
import { FC, MutableRefObject, useEffect, useRef } from 'react';

import Button from './tools/Button';
import { EmailTheme } from 'features/emails/types';
import LibraryImage from './tools/LibraryImage';
import { linkToolFactory } from './tools/InlineLink';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import variableToolFactory from './tools/inlineVariable';
import ParagraphWithSpanPaste from './tools/paragraphWithSpanPaste';

export type EmailEditorFrontendProps = {
  apiRef: MutableRefObject<EditorJS | null>;
  initialContent: OutputData;
  onSave: (data: OutputData) => void;
  onSelectBlock: (selectedBlockIndex: number) => void;
  readOnly: boolean;
  theme: EmailTheme | null;
};

const EmailEditorFrontend: FC<EmailEditorFrontendProps> = ({
  apiRef,
  theme: emailTheme,
  initialContent,
  onSave,
  onSelectBlock,
  readOnly,
}) => {
  const muiTheme = useTheme();
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
      readOnly: readOnly,
      tools: {
        button: {
          class: Button as unknown as ToolConstructable,
          config: {
            attributes: emailTheme?.block_attributes?.['button'] ?? {},
          },
        },
        header: {
          class: Header,
          config: {
            defaultLevel: 1,
            levels: [1, 2, 3],
          },
          inlineToolbar: ['variable'],
        },
        libraryImage: {
          class: LibraryImage as unknown as ToolConstructable,
          config: {
            attributes: emailTheme?.block_attributes?.['image'] ?? {},
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
              body2FontSize: muiTheme.typography.body2.fontSize,
              mediumGray: muiTheme.palette.grey[600],
              primaryColor: muiTheme.palette.primary.main,
              warningColor: muiTheme.palette.warning.main,
            },
          },
        },
        paragraph: {
          class: ParagraphWithSpanPaste as unknown as ToolConstructable,
        },
        variable: {
          class: variableToolFactory(messages.editor.tools.variable.title()),
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

  const styleSheet: CSSStyleSheet = new CSSStyleSheet();
  styleSheet.deleteRule;

  function prefixRule(rule: CSSRule): string {
    if (rule instanceof CSSStyleRule) {
      let text = '';
      if (rule.selectorText.startsWith('body')) {
        // Remove "body" so that body styling affects editor container instead
        text = `#ClientOnlyEditor-container ${rule.cssText.slice(4)}`;
      } else if (rule.selectorText.startsWith('.wrapper')) {
        text = `#ClientOnlyEditor-container .ce-block__content ${rule.cssText.slice(
          8
        )}`;
      } else {
        text = `#ClientOnlyEditor-container ${rule.cssText}`;
      }

      text = text.replace(/(?<=\W)p(?=\W)/, '.ce-paragraph');

      return text;
    } else {
      return rule.cssText;
    }
  }

  styleSheet.replaceSync(emailTheme?.css || '');
  const themeStyles = Array.from(styleSheet.cssRules)
    .map((rule) => {
      if (rule instanceof CSSMediaRule) {
        if (rule.conditionText.includes('dark')) {
          // Let's ignore dark mode for now
          return '';
        }

        return [
          // TODO: Uncomment this to enable light/dark mode
          //`@media ${rule.conditionText} {`,
          ...Array.from(rule.cssRules).map((rule) => '  ' + prefixRule(rule)),
          //'}',
        ].join('\n');
      } else {
        return prefixRule(rule);
      }
    })
    .join('\n');

  /*eslint-disable react/no-danger*/
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <Box
        id="ClientOnlyEditor-container"
        sx={{
          '& .ce-block__content': {
            px: 2,
          },
          minHeight: '100%',
        }}
      />
    </>
  );
};

export default EmailEditorFrontend;
