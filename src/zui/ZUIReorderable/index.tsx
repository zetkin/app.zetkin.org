import React, {
  FC,
  Key,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ELEMENT_TYPE } from 'utils/types/zetkin';
import ReorderableItem from './ZUIReorderableItem';

interface ZUIReorderableProps {
  children: React.ReactElement[];
  disabled: boolean;
  onReordering: () => void;
  onReorder: any;
  y?: number;
}

//Mock data
const elementsArray: any[] = [
  {
    hidden: false,
    key: 1,
    id: 1,
    text_block: {
      content: 'This is a content',
      header: 'this is a title',
    },
    type: ELEMENT_TYPE.TEXT,
  },
  {
    hidden: false,
    key: 2,
    id: 2,
    text_block: {
      content: '2 This is a content',
      header: '2 this is a title',
    },
    type: ELEMENT_TYPE.TEXT,
  },
  {
    hidden: false,
    key: 3,
    id: 3,
    text_block: {
      content: '2 This is a content',
      header: '2 this is a title',
    },
    type: ELEMENT_TYPE.TEXT,
  },
];

const ZUIReorderable: FC<ZUIReorderableProps> = ({
  disabled,
  onReordering,
  onReorder,
  children,
}) => {
  const [width, setWidth] = useState(0);
  const [activeKey, setActiveKey] = useState<Key | null>(null);
  const [dragging, setDragging] = useState(true);
  const [childNode, setChildNode] = useState<HTMLElement>();
  const [reordering, setOnReorder] = useState(onReorder);
  const [activeItem, setActiveItem] = useState();

  const orderFunction = (
    c0: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    c1: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    order: Key[]
  ) => {
    let idx0 = order.indexOf(c0.key!);
    let idx1 = order.indexOf(c1.key!);
    return idx0 - idx1;
  };

  const getKeys = (elementsArray: React.ReactElement[]): Key[] => {
    const f = elementsArray.filter((c) => c.key !== null);
    return f.map((child) => child.key!);
  };

  const [order, setOrder] = useState<Key[]>(getKeys(elementsArray));

  let elementRef = useRef<HTMLDivElement>(null);

  const orderedChildren = elementsArray
    .concat()
    .sort((c0, c1) => orderFunction(c0, c1, order));

  let createReorderableItems = orderedChildren.map((element, idx) => {
    if (!element.key) {
      throw 'Reorderable children must have keys';
    }

    let key = element.key;
    //elementRef = useRef<HTMLDivElement>(element as HTMLDivElement);
    let item: React.ReactElement = (
      <ReorderableItem
        id={element.id}
        key={key}
        itemKey={key}
        dragging={key == activeKey}
        onDragStart={(ev: any) => {
          console.log('HEREEEE');
          onItemDragStart(element.key, element, element.child, ev);
        }}
        onMouseMove={(ev: any) => onDocMouseMove(ev)}
        onMouseUp={(ev: any) => onDocMouseUp(ev)}
      >
        {element}
      </ReorderableItem>
    );

    return item;
  });

  const [items, setItems] = useState(createReorderableItems);

  const onDocMouseMove = (ev: any) => {
    console.log('inside onDocMouseMove', ev);
    let mouseDY = ev.movementY;
    let childNode = ev.target;
    let childElementStyle = ev.target.style;
    console.log('childNode', childNode);
    setChildNode(childNode);
    console.log('mouseDY', mouseDY); //Unnecessary?

    let y = ev.clientY - mouseDY;

    if (!dragging) {
      setDragging(true);
    }

    let prevKeys = items.map((item) => item.key);
    let orderedKeys = items
      .map((item) => ({
        y: item.key == activeKey ? y : item.props.y, // ?
        key: item.key,
      }))
      .sort((i0, i1) => i0.y - i1.y)
      .map((item) => item.key);

    //const childElementStyle = getComputedStyle(childNode);
    console.log('y', y);

    childNode.style.top = y + 'px';

    if (JSON.stringify(prevKeys) !== JSON.stringify(orderedKeys)) {
      if (reordering) {
        setOnReorder(orderedKeys);
      }
    }

    if (Object.keys(orderedKeys).length) {
      if (orderedKeys !== null) {
        setOrder(orderedKeys as Key[]);
      }
    }
  };

  const [mouseDY, setMouseDY] = useState<number>();
  const [startY, setStartY] = useState<number>();
  const [MousePosition, setMousePosition] = useState({
    left: 0,
    top: 0,
  });

  function handleMouseMove(ev: any) {
    setMousePosition({ left: ev.pageX, top: ev.pageY });
  }

  function onItemDragStart(key: Key, itemNode: any, childNode: any, ev: any) {
    console.log('inside onItemBeginDrag');
    setActiveKey(key);
    setChildNode(childNode);

    let ctrNode = document.getElementById(itemNode.id);
    let ctrRect = ctrNode?.getBoundingClientRect(); //What is ctrNode
    let itemRect = ev.target.getBoundingClientRect();

    console.log('ctrNode', ctrNode);
    console.log('ctrRect', ctrRect);
    console.log('itemRect', itemRect);
    console.log('ctrRect!.top', ctrRect!.top);
    console.log(' itemRect.top', itemRect.top);
    console.log('itemRect', ev.clientY);

    setMouseDY(ctrRect!.top + (ev.clientY - itemRect.top)); //estos setter pa ke?
    setStartY(itemRect.top - ctrRect!.top);
    console.log(mouseDY); //wehat is mouseDY (my guess is movementY)
    console.log(startY);
  }

  useEffect(() => {
    console.log('inside useeffect');
    const activeItem = items.find((item) => item.key === activeKey);
    console.log('activeItem', activeItem?.key);
    console.log('childNode', childNode);

    if (childNode) {
      const ctrNode = document.getElementById(childNode['id']); //how to make this real DOM Element?
      let ctrRect: DOMRect | undefined = ctrNode?.getBoundingClientRect();
      console.log(ctrRect);
      if (ctrNode !== null) {
        const elementDom = document.getElementById(ctrNode.id);
        console.log(ctrNode);
        console.log(elementDom);
      }

      let updatedItems = items.map((item) => {
        if (childNode) {
          let childRect = childNode.getBoundingClientRect();
          console.log(childNode);
          console.log(childRect);
          return Object.assign({}, item, {
            y: childRect!.top - ctrRect!.top,
          });
        }
      });
      if (updatedItems !== undefined) {
        setItems(updatedItems as React.ReactElement[]);
      }
    }
  }, [dragging]);

  function onDocMouseUp(ev: any) {
    console.log('inside mouse up');
    if (activeKey) {
      setDragging(false);
      setActiveKey(null);
      console.log(activeKey);
    }

    let prevOrder = items.map((child) => child.key);
    console.log(prevOrder);
    console.log(order);
    console.log(onReorder);

    if (JSON.stringify(!prevOrder) === JSON.stringify(order) && onReorder) {
      setOnReorder(order);
    }
  }

  return <div style={{ width: '100%' }}>{items}</div>;
};

export default ZUIReorderable;
