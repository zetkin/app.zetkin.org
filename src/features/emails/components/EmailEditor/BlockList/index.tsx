import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { FC, MutableRefObject, useState } from 'react';

import BlockListItem from './BlockListItem';

interface BlockListProps {
  apiRef: MutableRefObject<EditorJS | null>;
  blocks: OutputBlockData[];
  selectedBlockIndex: number;
}

const BlockList: FC<BlockListProps> = ({
  apiRef,
  blocks,
  selectedBlockIndex,
}) => {
  const [indexesOfExpanded, setIndexesOfExpanded] = useState<number[]>([]);
  return (
    <>
      {blocks.map((block, index) => (
        <BlockListItem
          key={block.id}
          apiRef={apiRef}
          block={block}
          expanded={indexesOfExpanded.includes(index)}
          onCollapse={() =>
            setIndexesOfExpanded(indexesOfExpanded.filter((i) => i !== index))
          }
          onExpand={() => setIndexesOfExpanded([...indexesOfExpanded, index])}
          selected={index === selectedBlockIndex}
        />
      ))}
    </>
  );
};

export default BlockList;
