import { ComponentMeta, ComponentStory } from '@storybook/react';

import SmartSearchSankeyDiagram from '.';

export default {
  component: SmartSearchSankeyDiagram,
  title: 'SmartSearchSankeyDiagram',
} as ComponentMeta<typeof SmartSearchSankeyDiagram>;

const Template: ComponentStory<typeof SmartSearchSankeyDiagram> = (args) => {
  return <SmartSearchSankeyDiagram {...args} />;
};

export const basic = Template.bind({});
basic.args = {
  segments: [
    {
      kind: 'entry',
      style: 'fill',
      width: 0.8,
    },
    {
      kind: 'add',
      main: {
        offset: 0.1,
        style: 'fill',
        width: 0.8,
      },
      side: {
        offset: -0.1,
        style: 'fill',
        width: 0.2,
      },
    },
    {
      kind: 'exit',
      style: 'fill',
      width: 1.0,
    },
  ],
};
