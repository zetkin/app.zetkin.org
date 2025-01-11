import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useRemirror,
} from '@remirror/react';
import { FC } from 'react';
import { BoldExtension } from 'remirror/extensions';
import { Box } from '@mui/material';

import LinkExtension from './extensions/LinkExtension';
import ButtonExtension from './extensions/ButtonExtension';
import BlockToolbar from './BlockToolbar';
import BlockInsert from './BlockInsert';
import BlockMenu from './BlockMenu';
import BlockMenuExtension from './extensions/BlockMenuExtension';
import EmptyBlockPlaceholder from './EmptyBlockPlaceholder';

const ZUIEditor: FC = () => {
  const btnExtension = new ButtonExtension();
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
      btnExtension,
      new LinkExtension(),
      new BlockMenuExtension({
        blockFactories: {
          button: () =>
            btnExtension.type.create(
              {},
              btnExtension.type.schema.text('Add button label here')
            ),
        },
      }),
    ],
    selection: 'start',
  });

  return (
    <Box
      sx={{
        ['.zbutton-button']: {
          bgcolor: 'black',
          color: 'white',
          padding: 1,
        },
        ['.zbutton-container']: {
          display: 'flex',
          justifyContent: 'center',
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
          <BlockInsert />
          <BlockToolbar />
          <EmptyBlockPlaceholder placeholder="Type / to insert block or just type some text" />
          <BlockMenu blocks={[{ id: 'button', label: 'Button' }]} />
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
