import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useRemirror,
} from '@remirror/react';
import { FC, useMemo } from 'react';
import {
  BoldExtension,
  BulletListExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  OrderedListExtension,
} from 'remirror/extensions';
import { AnyExtension, PasteRulesExtension } from 'remirror';
import { Box, useTheme } from '@mui/material';

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

type BlockExtension =
  | ButtonExtension
  | HeadingExtension
  | ImageExtension
  | OrderedListExtension
  | BulletListExtension;

type Props = {
  editable: boolean;
  enableBold?: boolean;
  enableButton?: boolean;
  enableHeading?: boolean;
  enableImage?: boolean;
  enableItalic?: boolean;
  enableLink?: boolean;
  enableLists?: boolean;
  enableVariable?: boolean;
};

const ZUIEditor: FC<Props> = ({
  editable,
  enableBold,
  enableButton,
  enableHeading,
  enableImage,
  enableItalic,
  enableLink,
  enableLists,
  enableVariable,
}) => {
  const messages = useMessages(messageIds.editor);
  const theme = useTheme();

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
      content: [
        {
          content: [
            {
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum tempus leo sit amet ornare. Aliquam efficitur arcu id ex efficitur viverra. Morbi malesuada posuere faucibus. Donec tempus ornare interdum. Aliquam ac mattis erat, sed dapibus odio. Sed sollicitudin turpis et diam ultrices, at luctus ex blandit. Sed semper, ligula tempus molestie hendrerit, nisi quam euismod lorem, ac ullamcorper felis lorem sit amet elit. Nullam lacinia tortor ut facilisis cursus. Nullam vel pulvinar magna, semper tristique lacus. Vivamus egestas lorem erat, eget rutrum arcu lobortis et. Quisque placerat nisi a porta dapibus. Donec sed congue risus. Pellentesque condimentum, nibh ac lobortis efficitur, dui dolor molestie tortor, id auctor libero erat eget diam. Fusce rutrum mollis congue. Aliquam erat volutpat. Praesent volutpat, nibh ut cursus dictum, mauris magna pulvinar elit, ut mattis ex felis id nulla.',
              type: 'text',
            },
          ],
          type: 'paragraph',
        },
      ],
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
    ],
    selection: 'start',
  });

  const enableBlockMenu = editable && blockExtensions.length > 0;

  return (
    <Box
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
          padding: 1,
        },
        ['[contenteditable="true"] > *']: {
          my: 2,
        },
      }}
    >
      <div style={{ minHeight: '200px' }}>
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
          />
          {enableBlockMenu && <EmptyBlockPlaceholder />}
          {enableBlockMenu && enableImage && <ImageExtensionUI orgId={orgId} />}
          {enableBlockMenu && enableButton && <ButtonExtensionUI />}
          {enableLink && <LinkExtensionUI />}
          <EditorComponent />
          <OnChangeJSON
            // eslint-disable-next-line no-console
            onChange={(updatedContent) => console.log(updatedContent)}
          />
        </Remirror>
      </div>
    </Box>
  );
};

export default ZUIEditor;
