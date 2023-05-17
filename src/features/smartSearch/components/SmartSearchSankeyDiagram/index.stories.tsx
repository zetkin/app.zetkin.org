import { ComponentMeta, ComponentStory } from '@storybook/react';

import SmartSearchSankeyDiagram from '.';

export default {
  component: SmartSearchSankeyDiagram,
  title: 'SmartSearchSankeyDiagram',
} as ComponentMeta<typeof SmartSearchSankeyDiagram>;

const Template: ComponentStory<typeof SmartSearchSankeyDiagram> = (args) => {
  return <SmartSearchSankeyDiagram filterStats={args.filterStats} />;
};

export const basic = Template.bind({});
basic.args = {
  filterStats: [
    {
      matched: 400,
      op: 'add',
      output: 400,
    },
    {
      matched: 300,
      op: 'add',
      output: 600,
    },
    {
      matched: 230,
      op: 'sub',
      output: 465,
    },
  ],
};
