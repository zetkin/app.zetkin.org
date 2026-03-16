import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useRemirror,
} from '@remirror/react';
import { FC, MutableRefObject, useMemo, useReducer, useRef } from 'react';
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
import LinkExtensionUI from './LinkExtensionUI';
import VariableExtension from './extensions/VariableExtension';
import ButtonExtensionUI from './ButtonExtensionUI';
import MoveExtension from './extensions/MoveExtension';
import IndentDedentExtension from './extensions/IndentDedentExtension';
import TransformPasteExtension from './extensions/TransformPasteExtension';
import { EmailContentBlock } from 'features/emails/types';
import zetkinToRemirror from './utils/zetkinToRemirror';
import remirrorToZetkin from './utils/remirrorToZetkin';
import { EmptyParagraphInsert } from './EmptyParagraphInsert';
import { EditorApi, ZUIEditorApi } from 'zui/ZUIEditor/EditorApi';
import useIsFocused from 'zui/hooks/useIsFocused';

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

export type { ZUIEditorApi } from './EditorApi';

type Props = {
  content: EmailContentBlock[];
  editable: boolean;
  editorApiRef?: MutableRefObject<ZUIEditorApi | null>;
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
  editorApiRef,
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

  const [, forceRender] = useReducer((x) => x + 1, 0);

  const focused = useIsFocused(editorContainerRef);

  const boldExtension = useRef(new BoldExtension({}));
  const btnExtension = useRef(new ButtonExtension());
  const imgExtension = useRef(new ImageExtension({}));
  const italicExtension = useRef(new ItalicExtension());
  const linkExtension = useRef(new LinkExtension());
  const olExtension = useRef(new OrderedListExtension());
  const ulExtension = useRef(new BulletListExtension({}));
  const headingExtension = useRef(new HeadingExtension({}));
  const varExtension = useRef(
    new VariableExtension({
      first_name: messages.variables.firstName(),
      full_name: messages.variables.fullName(),
      last_name: messages.variables.lastName(),
    })
  );

  const blockExtensions = useMemo(() => {
    const extensions: BlockExtension[] = [];
    if (enableButton) {
      extensions.push(btnExtension.current);
    }

    if (enableImage) {
      extensions.push(imgExtension.current);
    }

    if (enableHeading) {
      extensions.push(headingExtension.current);
    }

    if (enableLists) {
      extensions.push(olExtension.current);
      extensions.push(ulExtension.current);
    }
    return extensions;
  }, [enableButton, enableHeading, enableImage, enableLists]);

  const otherExtensions = useMemo(() => {
    const extensions: AnyExtension[] = [];

    if (enableBold) {
      extensions.push(boldExtension.current);
    }

    if (enableItalic) {
      extensions.push(italicExtension.current);
    }

    if (enableLink) {
      extensions.push(linkExtension.current);
    }

    if (enableVariable) {
      extensions.push(varExtension.current);
    }

    return extensions;
  }, [enableBold, enableItalic, enableLink, enableVariable]);

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
          bulletList: (props) => ulExtension.current.toggleBulletList()(props),
          heading: (props) => headingExtension.current.toggleHeading()(props),
          orderedList: (props) =>
            olExtension.current.toggleOrderedList()(props),
          zbutton: (props) =>
            btnExtension.current.insertButton(
              messages.extensions.button.defaultText()
            )(props),
          zimage: (props) => imgExtension.current.createAndPick()(props),
        },
      }),
      new MoveExtension(),
      new IndentDedentExtension(),
      new TransformPasteExtension(),
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
        '.zlink': {
          color: theme.palette.statusColors.blue,
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
        'img.zimage-image[src=""], img.zimage-image:not([src])': {
          height: '200px',
          width: '400px',
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
          {enableBlockMenu && (
            <EmptyParagraphInsert
              content={content}
              forceRerender={forceRender}
            />
          )}
          {enableBlockMenu && enableImage && <ImageExtensionUI orgId={orgId} />}
          {enableBlockMenu && enableButton && <ButtonExtensionUI />}
          {editorApiRef && <EditorApi editorApiRef={editorApiRef} />}
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
