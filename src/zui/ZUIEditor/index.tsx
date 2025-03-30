import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useRemirror,
} from '@remirror/react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  BoldExtension,
  BulletListExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  OrderedListExtension,
} from 'remirror/extensions';
import {
  AnyExtension,
  FromToProps,
  PasteRulesExtension,
  ProsemirrorNode,
} from 'remirror';
import { Box, useTheme } from '@mui/material';
import { Attrs } from '@remirror/pm/model';

import LinkExtension from './extensions/LinkExtension';
import ButtonExtension from './extensions/ButtonExtension';
import BlockMenuExtension from './extensions/BlockMenuExtension';
import EmptyBlockPlaceholder from './EmptyBlockPlaceholder';
import ImageExtension from './extensions/ImageExtension';
import ImageExtensionUI from './ImageExtensionUI';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import EditorOverlays from './EditorOverlays';
import VariableExtension from './extensions/VariableExtension';
import LinkExtensionUI from './LinkExtensionUI';
import ButtonExtensionUI from './ButtonExtensionUI';
import MoveExtension from './extensions/MoveExtension';
import IndentDedentExtension from './extensions/IndentDedentExtension';
import { EmailContentBlock } from 'features/emails/types';
import zetkinToRemirror from './utils/zetkinToRemirror';
import remirrorToZetkin from './utils/remirrorToZetkin';

type BlockExtension =
  | ButtonExtension
  | HeadingExtension
  | ImageExtension
  | OrderedListExtension
  | BulletListExtension;

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'orderedList'
  | 'bulletList'
  | 'zimage'
  | 'zbutton';

export type BlockData = {
  attributes: Attrs;
  node: ProsemirrorNode;
  range: FromToProps;
  rect: DOMRect;
  type: BlockType;
};

type Props = {
  content: EmailContentBlock[];
  editable: boolean;
  enableBold?: boolean;
  enableButton?: boolean;
  enableHeading?: boolean;
  enableImage?: boolean;
  enableItalic?: boolean;
  enableLink?: boolean;
  enableLists?: boolean;
  enableVariable?: boolean;
  onChange: (newContent: EmailContentBlock[]) => void;
  onSelectBlock: (selectedBlockIndex: number) => void;
};

const ZUIEditor: FC<Props> = ({
  content,
  editable,
  enableBold,
  enableButton,
  enableHeading,
  enableImage,
  enableItalic,
  enableLink,
  enableLists,
  enableVariable,
  onChange,
  onSelectBlock,
}) => {
  const messages = useMessages(messageIds.editor);
  const theme = useTheme();
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const editorContainer = editorContainerRef.current;

    if (editorContainer) {
      const detectClickOnEditor = (ev: Event) => {
        const clickedInside = ev.composedPath().includes(editorContainer);
        if (clickedInside) {
          setFocused(true);
        } else {
          setFocused(false);
        }
      };

      document.addEventListener('click', detectClickOnEditor);

      return () => {
        document.removeEventListener('click', detectClickOnEditor);
      };
    }
  }, [document]);

  const boldExtension = new BoldExtension({});
  const btnExtension = new ButtonExtension();
  const imgExtension = new ImageExtension({});
  const italicExtension = new ItalicExtension();
  const linkExtension = new LinkExtension();
  const olExtension = new OrderedListExtension();
  const ulExtension = new BulletListExtension({});
  const headingExtension = new HeadingExtension({});
  const varExtension = new VariableExtension({
    first_name: messages.variables.firstName(),
    full_name: messages.variables.fullName(),
    last_name: messages.variables.lastName(),
  });

  const blockExtensions = useMemo(() => {
    const extensions: BlockExtension[] = [];
    if (enableButton) {
      extensions.push(btnExtension);
    }

    if (enableImage) {
      extensions.push(imgExtension);
    }

    if (enableHeading) {
      extensions.push(headingExtension);
    }

    if (enableLists) {
      extensions.push(olExtension);
      extensions.push(ulExtension);
    }
    return extensions;
  }, []);

  const otherExtensions = useMemo(() => {
    const extensions: AnyExtension[] = [];

    if (enableBold) {
      extensions.push(boldExtension);
    }

    if (enableItalic) {
      extensions.push(italicExtension);
    }

    if (enableLink) {
      extensions.push(linkExtension);
    }

    if (enableVariable) {
      extensions.push(varExtension);
    }

    return extensions;
  }, []);

  const { orgId } = useNumericRouteParams();

  const { manager, state } = useRemirror({
    content: {
      content: zetkinToRemirror(content),
      type: 'doc',
    },
    extensions: () => [
      new PasteRulesExtension({}),
      ...blockExtensions,
      ...otherExtensions,
      new HardBreakExtension(),
      new BlockMenuExtension({
        blockFactories: {
          bulletList: (props) => ulExtension.toggleBulletList()(props),
          heading: (props) => headingExtension.toggleHeading()(props),
          orderedList: (props) => olExtension.toggleOrderedList()(props),
          zbutton: (props) =>
            btnExtension.insertButton(messages.extensions.button.defaultText())(
              props
            ),
          zimage: (props) => imgExtension.createAndPick()(props),
        },
      }),
      new MoveExtension(),
      new IndentDedentExtension(),
    ],
    selection: 'start',
  });

  const enableBlockMenu = editable && blockExtensions.length > 0;

  return (
    <Box
      display="flex"
      justifyContent="center"
      paddingTop={5}
      sx={{
        '.zbutton-button': {
          bgcolor: 'black',
          color: 'white',
          padding: 1,
        },
        '.zbutton-container': {
          display: 'flex',
          justifyContent: 'center',
        },
        '.zimage-image': {
          maxWidth: '100%',
        },
        '.zvariable': {
          '&.ProseMirror-selectednode': {
            outlineColor: theme.palette.grey[600],
            outlineStyle: 'solid',
            outlineWidth: 1,
          },
          bgcolor: theme.palette.grey[400],
          borderRadius: '1em',
          display: 'inline-block',
          mx: 0.25,
          px: 1,
        },
        ['[contenteditable="true"]']: {
          outline: '0px solid transparent',
          padding: 1,
        },
        ['[contenteditable="true"] > *']: {
          my: 2,
        },
      }}
    >
      <div
        ref={editorContainerRef}
        style={{ minHeight: '200px', width: '600px' }}
      >
        <Remirror editable={editable} initialContent={state} manager={manager}>
          <EditorOverlays
            blocks={blockExtensions.map((ext) => ({
              id: ext.name,
              label: messages.blockLabels[ext.name](),
            }))}
            editable={editable}
            enableBold={!!enableBold}
            enableItalic={!!enableItalic}
            enableLink={!!enableLink}
            enableVariable={!!enableVariable}
            focused={focused}
            onSelectBlock={(selectedBlock) => onSelectBlock(selectedBlock)}
            zetkinContent={content}
          />
          {enableBlockMenu && <EmptyBlockPlaceholder />}
          {enableBlockMenu && enableImage && <ImageExtensionUI orgId={orgId} />}
          {enableBlockMenu && enableButton && <ButtonExtensionUI />}
          {enableLink && <LinkExtensionUI />}
          <EditorComponent />
          <OnChangeJSON
            onChange={(updatedContent) => {
              if (updatedContent.content) {
                const zetkinContent = remirrorToZetkin(updatedContent.content);
                onChange(zetkinContent);
              }
            }}
          />
        </Remirror>
      </div>
    </Box>
  );
};

export default ZUIEditor;
