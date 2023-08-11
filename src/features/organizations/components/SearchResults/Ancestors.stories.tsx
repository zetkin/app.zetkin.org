import { ComponentMeta, ComponentStory } from '@storybook/react';

import Ancestors from './Ancestors';

export default {
  component: Ancestors,
  title: 'Ancestors',
} as ComponentMeta<typeof Ancestors>;

const Template: ComponentStory<typeof Ancestors> = (args) => (
  <Ancestors ancestors={args.ancestors} />
);

export const topLevel = Template.bind({});
topLevel.args = {
  ancestors: [],
};

export const oneAncestor = Template.bind({});
oneAncestor.args = {
  ancestors: [
    {
      children: [],
      id: 34,
      parent: null,
      title: 'Parent org',
    },
  ],
};

export const twoAncestorsFirstCollapsed = Template.bind({});
twoAncestorsFirstCollapsed.args = {
  ancestors: [
    {
      children: [],
      id: 34,
      parent: null,
      title: 'A long name of ancestor',
    },
    {
      children: [],
      id: 15,
      parent: null,
      title: 'Parent org',
    },
  ],
};

export const twoAncestorsFirstShowing = Template.bind({});
twoAncestorsFirstShowing.args = {
  ancestors: [
    {
      children: [],
      id: 34,
      parent: null,
      title: 'Ancestor',
    },
    {
      children: [],
      id: 15,
      parent: null,
      title: 'Parent org',
    },
  ],
};

export const manyAncestorsAllCollapsed = Template.bind({});
manyAncestorsAllCollapsed.args = {
  ancestors: [
    {
      children: [],
      id: 34,
      parent: null,
      title: 'Organization',
    },
    {
      children: [],
      id: 15,
      parent: null,
      title: 'A long name of ancestor',
    },
    {
      children: [],
      id: 15,
      parent: null,
      title: 'Parent org',
    },
  ],
};

export const manyAncestorsMiddleShowing = Template.bind({});
manyAncestorsMiddleShowing.args = {
  ancestors: [
    {
      children: [],
      id: 34,
      parent: null,
      title: 'Organization',
    },
    {
      children: [],
      id: 15,
      parent: null,
      title: 'Ancestor',
    },
    {
      children: [],
      id: 15,
      parent: null,
      title: 'Parent org',
    },
  ],
};
