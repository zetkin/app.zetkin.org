import { Box, Menu, MenuItem } from '@mui/material';
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

  const blocks: MentionExtensionAttributes[] = [
    { id: 'button', label: 'Button' },
  ];

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
        sx={{ left: positioner.x, position: 'absolute', top: positioner.y }}
      />
      <Menu
        open={positioner.active && isOpen}
        {...menu.getMenuProps()}
        anchorEl={positioner.element}
        onClose={() => {
          setIgnore(true);
        }}
      >
        {isOpen &&
          blocks.map((item, index) => {
            return (
              <MenuItem
                key={item.id}
                component="a"
                {...menu.getItemProps({ index, item })}
              >
                {item.label}
              </MenuItem>
            );
          })}
      </Menu>
    </Box>
  );
};

export default BlockMenu;
