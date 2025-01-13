import {
  useCommands,
  useExtensionEvent,
  useMenuNavigation,
} from '@remirror/react';
import { useState } from 'react';

import BlockMenuExtension from '../extensions/BlockMenuExtension';

export default function useBlockMenu(
  blocks: {
    id: string;
    label: string;
  }[]
) {
  const [query, setQuery] = useState<string | null>(null);
  const [ignore, setIgnore] = useState(false);

  const { insertBlock } = useCommands();

  useExtensionEvent(BlockMenuExtension, 'onBlockQuery', (newQuery) => {
    setQuery(newQuery);
    if (newQuery == null) {
      setIgnore(false);
    }
  });

  const isOpen = query !== null && !ignore;

  const filteredBlocks = blocks.filter(
    (block) =>
      !query ||
      query == '' ||
      block.id.toLowerCase().startsWith(query.toLowerCase()) ||
      block.label.toLowerCase().startsWith(query.toLowerCase())
  );

  const menu = useMenuNavigation({
    isOpen: isOpen,
    items: filteredBlocks,
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

  return {
    filteredBlocks,
    isOpen,
    menu,
  };
}
