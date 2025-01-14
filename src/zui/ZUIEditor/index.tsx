import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useRemirror,
} from '@remirror/react';
import { FC } from 'react';
import { BoldExtension, HeadingExtension } from 'remirror/extensions';
import { Box } from '@mui/material';

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

type ZetkinExtension = ButtonExtension | HeadingExtension | ImageExtension;

type Props = {
  enableButton?: boolean;
  enableHeading?: boolean;
  enableImage?: boolean;
};

const ZUIEditor: FC<Props> = ({ enableButton, enableHeading, enableImage }) => {
  const messages = useMessages(messageIds.editor);

  const btnExtension = new ButtonExtension();
  const imgExtension = new ImageExtension({});
  const headingExtension = new HeadingExtension({});

  const extensions: ZetkinExtension[] = [];

  if (enableButton) {
    extensions.push(btnExtension);
  }

  if (enableImage) {
    extensions.push(imgExtension);
  }

  if (enableHeading) {
    extensions.push(headingExtension);
  }

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
      new BoldExtension({}),
      ...extensions,
      new LinkExtension(),
      new BlockMenuExtension({
        blockFactories: {
          heading: () => headingExtension.type.create({}),
          zbutton: () =>
            btnExtension.type.create(
              {},
              btnExtension.type.schema.text('Add button label here')
            ),
          zimage: () => imgExtension.createAndPick(),
        },
      }),
    ],
    selection: 'start',
  });

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
        ['[contenteditable="true"]']: {
          padding: 1,
        },
        ['[contenteditable="true"] > *']: {
          my: 2,
        },
      }}
    >
      <div style={{ minHeight: '200px' }}>
        <Remirror initialContent={state} manager={manager}>
          <EditorOverlays
            blocks={extensions.map((ext) => ({
              id: ext.name,
              label: messages.blockLabels[ext.name](),
            }))}
          />
          <EmptyBlockPlaceholder placeholder={messages.placeholder()} />
          {enableImage && <ImageExtensionUI orgId={orgId} />}
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
