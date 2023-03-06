import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIReorderable from '.';

export default {
  component: ZUIReorderable,
  title: 'Atoms/ZUIReorderable',
} as ComponentMeta<typeof ZUIReorderable>;

const Template: ComponentStory<typeof ZUIReorderable> = (args) => (
  <div style={{ width: 400 }}>
    <ZUIReorderable items={args.items} />
  </div>
);

export const basic = Template.bind({});
basic.args = {
  items: [
    { element: <h1>Hello</h1>, id: 1 },
    { element: <h1>Goodbye</h1>, id: 2 },
    { element: <h1>See you later</h1>, id: 3 },
    { element: <h1>Good night</h1>, id: 4 },
  ],
};
