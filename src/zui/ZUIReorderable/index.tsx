import { Box } from '@mui/system';
import { DragIndicatorOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import {
  FC,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

type IDType = number | string;

type ReorderableItem = {
  element: JSX.Element;
  id: IDType;
};

type ZUIReorderableProps = {
  items: ReorderableItem[];
};

const ZUIReorderable: FC<ZUIReorderableProps> = ({ items }) => {
  const [order, setOrder] = useState<IDType[]>(items.map((item) => item.id));
  const [activeId, setActiveId] = useState<IDType | null>(null);

  const activeItemRef = useRef<ReorderableItem>();

  useEffect(() => {
    setOrder(items.map((item) => item.id));
  }, [items]);

  const dyRef = useRef<number>();
  const ctrRef = useRef<HTMLDivElement>();
  const activeContentRef = useRef<HTMLDivElement>();
  const nodeByIdRef = useRef<Record<IDType, HTMLDivElement>>({});

  const onMouseMove = (ev: MouseEvent) => {
    const ctrRect = ctrRef.current?.getBoundingClientRect();
    const ctrY = ctrRect?.top ?? 0;
    const targetY = ev.clientY - ctrY - (dyRef.current || 0);

    const activeId = activeItemRef.current?.id ?? 0;

    const prevKeys = order;
    const reorderedItems = items
      .map((item) => {
        const y =
          activeId == item.id
            ? targetY
            : nodeByIdRef.current[item.id].getBoundingClientRect().top;

        return {
          id: item.id,
          y: y,
        };
      })
      .sort((item0, item1) => item0.y - item1.y);

    const reorderedKeys = reorderedItems.map((item) => item.id);

    if (prevKeys.join(',') != reorderedKeys.join(',')) {
      setOrder(reorderedKeys);
    }

    if (activeContentRef.current) {
      activeContentRef.current.style.top = targetY + 'px';
    }
  };

  const onMouseUp = () => {
    // console.log('release');

    setActiveId(null);
    activeItemRef.current = undefined;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const sortedItems = items.concat().sort((item0, item1) => {
    return order.indexOf(item0.id) - order.indexOf(item1.id);
  });

  return (
    <Box ref={ctrRef} sx={{ position: 'relative' }}>
      {sortedItems.map((item) => {
        return (
          <ZUIReorderableItem
            key={item.id}
            dragging={activeId == item.id}
            item={item}
            onBeginDrag={(contentNode, ev, itemNode) => {
              setActiveId(item.id);
              activeItemRef.current = item;
              activeContentRef.current = contentNode;

              // When dragging starts, "hard-code" the height of the
              // item container, so that it doesn't collapse once the
              // item content starts moving.
              const itemRect = itemNode.getBoundingClientRect();
              itemNode.style.height = itemRect.height + 'px';

              dyRef.current = ev.clientY - itemRect.top;

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            onNodeExists={(div) => (nodeByIdRef.current[item.id] = div)}
          />
        );
      })}
    </Box>
  );
};

const ZUIReorderableItem: FC<{
  dragging: boolean;
  item: ReorderableItem;
  onBeginDrag: (
    contentNode: HTMLDivElement,
    ev: ReactMouseEvent<HTMLElement>,
    itemNode: HTMLDivElement
  ) => void;
  onNodeExists: (node: HTMLDivElement) => void;
}> = ({ dragging, item, onBeginDrag, onNodeExists }) => {
  const itemRef = useRef<HTMLDivElement>();
  const contentRef = useRef<HTMLDivElement>();

  return (
    <Box
      key={item.id}
      ref={(div: HTMLDivElement) => {
        itemRef.current = div;
        onNodeExists(div);
      }}
    >
      <Box
        ref={contentRef}
        display="flex"
        sx={{
          position: dragging ? 'absolute' : 'static',
        }}
      >
        <Box>
          <IconButton
            onMouseDown={(ev) => {
              if (itemRef.current && contentRef.current) {
                onBeginDrag(contentRef.current, ev, itemRef.current);
              }
            }}
          >
            <DragIndicatorOutlined />
          </IconButton>
        </Box>
        <Box
          sx={{
            boxShadow: dragging ? '0 0 10px black' : 'none',
          }}
        >
          {item.element}
        </Box>
      </Box>
    </Box>
  );
};

export default ZUIReorderable;
