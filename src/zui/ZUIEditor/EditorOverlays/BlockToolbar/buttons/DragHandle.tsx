import { DragIndicatorOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useDrag } from 'react-dnd';
import { FC } from 'react';

interface DragHandleProps {
  blockIndex: number;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
}

interface DragItem {
  blockIndex: number;
  type: string;
}

const DragHandle: FC<DragHandleProps> = ({
  blockIndex,
  onDragStart,
  onDragEnd,
}) => {
  const [, drag] = useDrag({
    end: () => {
      onDragEnd();
    },
    item: () => {
      onDragStart(blockIndex);
      return {
        blockIndex,
        type: 'EDITOR_BLOCK',
      } satisfies DragItem;
    },
    type: 'EDITOR_BLOCK',
  });

  return (
    <IconButton
      ref={(node) => {
        if (node) {
          drag(node);
        }
      }}
      data-button-type={'dnd'}
    >
      <DragIndicatorOutlined fontSize="inherit" />
    </IconButton>
  );
};

export default DragHandle;
