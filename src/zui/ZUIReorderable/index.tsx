import { Box, BoxProps, IconButton } from '@mui/material';
import {
  DragIndicatorOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {
  FC,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

type IDType = number | string;

export type ZUIReorderableRenderProps = {
  dragging: boolean;
};

type ReorderableItem = {
  hidden?: boolean;
  id: IDType;
  renderContent: (props: ZUIReorderableRenderProps) => JSX.Element;
};

export enum ZUIReorderableWidget {
  DRAG = 'drag',
  MOVE_DOWN = 'down',
  MOVE_UP = 'up',
}

type ZUIReorderableProps = {
  centerWidgets?: boolean;
  disableClick?: boolean;
  disableDrag?: boolean;
  items: ReorderableItem[];
  onReorder: (ids: IDType[]) => void;
  onReordering?: () => void;
  widgets?: ZUIReorderableWidget[];
  widgetsOnlyOnHover?: boolean;
  widgetsProps?: BoxProps;
};

const ZUIReorderable: FC<ZUIReorderableProps> = ({
  centerWidgets,
  disableClick,
  disableDrag,
  items,
  onReorder,
  onReordering,
  widgets = [
    ZUIReorderableWidget.DRAG,
    ZUIReorderableWidget.MOVE_UP,
    ZUIReorderableWidget.MOVE_DOWN,
  ],
  widgetsOnlyOnHover = false,
  widgetsProps,
}) => {
  const [order, setOrder] = useState<IDType[]>(items.map((item) => item.id));
  const [activeId, setActiveId] = useState<IDType | null>(null);

  const activeItemRef = useRef<ReorderableItem>();

  useEffect(() => {
    setOrder(items.map((item) => item.id));
  }, [items]);

  useEffect(() => {
    if (!activeId) {
      // We just finished dragging. Check if the order changed, and
      // alert the surroundings if it did.
      // NOTE: It would be nicer to do this in `onMouseUp`, but because
      // the closure of `onMouseUp` is created on mouse down, the order
      // never changes from the perspective of `onMouseUp`.
      const prevKeys = items.map((item) => item.id);
      if (order.join(',') != prevKeys.join(',')) {
        onReorder(order);
      }
    }
  }, [activeId]);

  const yOffsetRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>();
  const activeContentNodeRef = useRef<HTMLDivElement>();
  const activeItemNodeRef = useRef<HTMLDivElement>();
  const nodeByIdRef = useRef<Record<IDType, HTMLDivElement>>({});

  const onMouseMove = (ev: MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const containerY = containerRect?.top ?? 0;

    // Only allow dragging 10px beyond the top of the container, and just
    // beyond the bottom of the container
    const newClientY = Math.max(
      containerY - 10,
      Math.min(
        ev.clientY - (yOffsetRef.current || 0),
        containerRect?.bottom ?? 0
      )
    );

    const activeId = activeItemRef.current?.id ?? 0;

    const reorderedKeys = items
      .map((item) => {
        const y =
          activeId == item.id
            ? newClientY
            : nodeByIdRef.current[item.id].getBoundingClientRect().top;

        return {
          id: item.id,
          y: y,
        };
      })
      .sort((item0, item1) => item0.y - item1.y)
      .map((item) => item.id);

    setOrder(reorderedKeys);

    if (activeContentNodeRef.current) {
      activeContentNodeRef.current.style.top = newClientY - containerY + 'px';
    }
  };

  const onMouseUp = () => {
    setActiveId(null);

    // Reset content width
    if (activeContentNodeRef.current) {
      activeContentNodeRef.current.style.width = 'auto';
    }

    if (activeItemNodeRef.current) {
      activeItemNodeRef.current.style.height = 'auto';
    }
    activeItemRef.current = undefined;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const sortedItems = items.concat().sort((item0, item1) => {
    return order.indexOf(item0.id) - order.indexOf(item1.id);
  });

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      {sortedItems.map(
        (item, index) =>
          !item.hidden && (
            <ZUIReorderableItem
              key={item.id}
              centerWidgets={!!centerWidgets}
              dragging={activeId == item.id}
              item={item}
              onBeginDrag={(itemNode, contentNode, ev) => {
                setActiveId(item.id);
                activeItemRef.current = item;
                activeItemNodeRef.current = itemNode;
                activeContentNodeRef.current = contentNode;

                // When dragging starts, "hard-code" the height of the
                // item container, so that it doesn't collapse once the
                // item content starts moving.
                const itemRect = itemNode.getBoundingClientRect();
                itemNode.style.height = itemRect.height + 'px';

                // Also "hard-code" width of item, so that it doesn't
                // collapse if it's a flex item
                const contentRect = contentNode.getBoundingClientRect();
                contentNode.style.width = contentRect.width + 'px';

                yOffsetRef.current = ev.clientY - itemRect.top;

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);

                if (onReordering) {
                  onReordering();
                }
              }}
              onClickDown={() => {
                if (index + 1 < items.length) {
                  const ids = items.map((item) => item.id);
                  const current = ids[index];
                  ids[index] = ids[index + 1];
                  ids[index + 1] = current;

                  onReorder(ids);
                }
              }}
              onClickUp={() => {
                if (index > 0) {
                  const ids = items.map((item) => item.id);
                  const current = ids[index];
                  ids[index] = ids[index - 1];
                  ids[index - 1] = current;

                  onReorder(ids);
                }
              }}
              onNodeExists={(div) => (nodeByIdRef.current[item.id] = div)}
              widgets={widgets.filter((widget) => {
                if (disableClick) {
                  // Hide all widgets when click is disabled
                  return false;
                }

                if (
                  widget == ZUIReorderableWidget.MOVE_DOWN &&
                  index < items.length - 1
                ) {
                  return true;
                } else if (
                  widget == ZUIReorderableWidget.MOVE_UP &&
                  index > 0
                ) {
                  return true;
                } else if (
                  widget == ZUIReorderableWidget.DRAG &&
                  !disableDrag
                ) {
                  return true;
                }

                return false;
              })}
              widgetsOnlyOnHover={widgetsOnlyOnHover}
              widgetsProps={widgetsProps}
            />
          )
      )}
    </Box>
  );
};

const ZUIReorderableItem: FC<{
  centerWidgets: boolean;
  dragging: boolean;
  item: ReorderableItem;
  onBeginDrag: (
    itemNode: HTMLDivElement,
    contentNode: HTMLDivElement,
    ev: ReactMouseEvent<HTMLElement>
  ) => void;
  onClickDown: () => void;
  onClickUp: () => void;
  onNodeExists: (node: HTMLDivElement) => void;
  widgets: ZUIReorderableWidget[];
  widgetsOnlyOnHover?: boolean;
  widgetsProps?: BoxProps;
}> = ({
  centerWidgets,
  dragging,
  item,
  onBeginDrag,
  onClickDown,
  onClickUp,
  onNodeExists,
  widgets,
  widgetsOnlyOnHover = false,
  widgetsProps,
}) => {
  const [hovered, setHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>();
  const contentRef = useRef<HTMLDivElement>();

  return (
    <Box
      key={item.id}
      ref={(div: HTMLDivElement) => {
        itemRef.current = div;
        onNodeExists(div);
      }}
      onMouseOut={() => setHovered(false)}
      onMouseOver={() => setHovered(true)}
    >
      <Box
        ref={contentRef}
        alignItems={centerWidgets ? 'center' : 'start'}
        display="flex"
        sx={{
          position: dragging ? 'absolute' : 'static',
        }}
      >
        <Box display="flex" flexDirection="column" {...widgetsProps}>
          {widgets.map((widget) => {
            if (widgetsOnlyOnHover && !hovered) {
              // Hide all widgets when not hovering
              return false;
            }

            if (widget == ZUIReorderableWidget.DRAG) {
              return (
                <IconButton
                  onMouseDown={(ev) => {
                    if (itemRef.current && contentRef.current) {
                      onBeginDrag(itemRef.current, contentRef.current, ev);
                    }
                  }}
                >
                  <DragIndicatorOutlined />
                </IconButton>
              );
            } else if (widget == ZUIReorderableWidget.MOVE_DOWN) {
              return (
                <IconButton onClick={() => onClickDown()}>
                  <KeyboardArrowDown />
                </IconButton>
              );
            } else if (widget == ZUIReorderableWidget.MOVE_UP) {
              return (
                <IconButton onClick={() => onClickUp()}>
                  <KeyboardArrowUp />
                </IconButton>
              );
            }
          })}
        </Box>
        <Box flex="1 0" zIndex={dragging ? '100' : '0'}>
          {item.renderContent({
            dragging,
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ZUIReorderable;
