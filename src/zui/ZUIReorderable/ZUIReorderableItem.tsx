import { Box } from '@mui/material';
import { FC, Key, useEffect, useState } from 'react';

interface ReorderableItemProps {
  key: Key;
  itemKey: Key;
  dragging: boolean;
  children: any;
  onDragStart: any;
  onMouseMove: any;
  onMouseUp: any;
  id: any;
}

const ReorderableItem: FC<ReorderableItemProps> = ({
  children,
  dragging,
  onMouseMove,
  onMouseUp,
  onDragStart,
  itemKey,
  key,
  id,
}) => {
  const [itemNode, setItemNode] = useState<HTMLElement>(
    document.getElementById(id)!
  );
  console.log('itemNode1', itemNode);

  function onMouseDown(ev: any) {
    console.log('inside mouse Down');
    if (onDragStart) {
      ev.preventDefault();

      let itemNode = ev.target;
      setItemNode(itemNode);
      let childNode = itemNode.firstChild;

      console.log('dentro de REORitem', itemNode, childNode);

      onDragStart(itemKey, itemNode, childNode, ev);
    }
  }

  useEffect(() => {
    if (itemNode !== null) {
      let newItemNode = document.getElementById(itemNode.id);
      let itemRect = newItemNode!.getBoundingClientRect();

      /*  let childNode = newItemNode!.firstChild;
      let childRect = childNode!.getBoundingClientRect();

      if (nextProps.dragging) {
        itemNode.style.height = itemRect.height + 'px';

        childNode.style.position = 'absolute';
        childNode.style.width = childRect.width + 'px';
      } else {
        itemNode.style.height = '';
        childNode.style.position = '';
        childNode.style.top = '';
        childNode.style.width = '';
      }*/
    }
  });

  return (
    <Box
      style={{ width: '200px', border: 'black solid 1px', margin: '15px' }}
      //onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      key={key}
      id={id}
      onDragStart={onDragStart}
      onMouseDown={(ev: any) => onMouseDown(ev)}
    >
      {children.text_block.content}
    </Box>
  );
};

export default ReorderableItem;
