import MovieIcon from '@material-ui/icons/Movie';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZetkinEllipsisMenu from './ZetkinEllipsisMenu';

export default {
  component: ZetkinEllipsisMenu,
  title: 'Atoms/ZetkinEllipsisMenu',
} as ComponentMeta<typeof ZetkinEllipsisMenu>;

const Template: ComponentStory<typeof ZetkinEllipsisMenu> = (args) => (
  <ZetkinEllipsisMenu items={args.items} />
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
