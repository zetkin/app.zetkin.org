import { Box, MenuItem, Paper } from '@mui/material';
import {
  useCommands,
  useExtensionEvent,
  useMenuNavigation,
  usePositioner,
} from '@remirror/react';
import { FC, useState } from 'react';
import { MentionExtensionAttributes } from 'remirror/extensions';

import BlockMenuExtension from './extensions/BlockMenuExtension';

const BlockMenu: FC = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [ignore, setIgnore] = useState(false);
  const positioner = usePositioner('cursor');
  const { insertBlock } = useCommands();

  useExtensionEvent(BlockMenuExtension, 'onBlockQuery', (newQuery) => {
    setQuery(newQuery);
    if (newQuery == null) {
      setIgnore(false);
    }
  });

  const allBlocks: MentionExtensionAttributes[] = [
    { id: 'button', label: 'Button' },
  ];

  const blocks = allBlocks.filter(
    (block) =>
      !query ||
      query == '' ||
      block.id.toLowerCase().startsWith(query.toLowerCase()) ||
      block.label.toLowerCase().startsWith(query.toLowerCase())
  );

  const isOpen = query !== null && !ignore;

  const menu = useMenuNavigation({
    isOpen: isOpen,
    items: blocks,
    onDismiss: () => {
      setQuery(null);
      setIgnore(true);
      return true;
    },
    onSubmit: (blockType) => {
      setQuery(null);
      insertBlock(blockType.id);
      return true;
    },
  });

  return (
    <Box position="relative">
      <Box
        ref={positioner.ref}
        sx={{
          left: positioner.x,
          position: 'absolute',
          top: positioner.y,
        }}
      >
        <Box {...menu.getMenuProps()}>
          <Paper>
            {isOpen &&
              blocks.map((item, index) => {
                const props = menu.getItemProps({ index, item });
                return (
                  <MenuItem
                    key={item.id}
                    component="a"
                    selected={!!props['aria-current']}
                    {...props}
                  >
                    {item.label}
                  </MenuItem>
                );
              })}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default BlockMenu;
