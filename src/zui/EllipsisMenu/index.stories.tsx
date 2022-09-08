import MovieIcon from '@material-ui/icons/Movie';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EllipsisMenu from '.';

export default {
  component: EllipsisMenu,
  title: 'Atoms/EllipsisMenu',
} as ComponentMeta<typeof EllipsisMenu>;

const Template: ComponentStory<typeof EllipsisMenu> = (args) => (
  <EllipsisMenu items={args.items} />
);

export const basic = Template.bind({});
basic.args = {
  items: [{ label: 'Dirty Dancing' }],
};

export const startIcon = Template.bind({});
startIcon.args = {
  items: [
    {
      label: 'Dirty Dancing',
      startIcon: <MovieIcon />,
    },
  ],
};

export const subMenu = Template.bind({});
subMenu.args = {
  items: [
    {
      label: 'Dirty Dancing',
      subMenuItems: [
        {
          label: 'Dirty Dancing 2: Electric Boogaloo',
        },
      ],
    },
  ],
};
