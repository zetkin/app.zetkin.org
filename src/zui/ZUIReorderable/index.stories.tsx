import { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIReorderable from '.';

export default {
  component: ZUIReorderable,
  title: 'Atoms/ZUIReorderable',
} as ComponentMeta<typeof ZUIReorderable>;

const Template: ComponentStory<typeof ZUIReorderable> = (args) => {
  const [items, setItems] = useState(args.items);

  return (
    <div style={{ width: 400 }}>
      <ZUIReorderable
        items={items}
        onReorder={(ids) => {
          setItems(ids.map((id) => args.items.find((item) => item.id == id)!));
        }}
      />
    </div>
  );
};

export const basic = Template.bind({});
basic.args = {
  items: [
    { id: 1, renderContent: () => <h1>Hello</h1> },
    { id: 2, renderContent: () => <h1>Goodbye</h1> },
    { id: 3, renderContent: () => <h1>See you later</h1> },
    { id: 4, renderContent: () => <h1>Good night</h1> },
  ],
};
