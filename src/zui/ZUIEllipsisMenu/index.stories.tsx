import MovieIcon from '@mui/icons-material/Movie';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ZUIEllipsisMenu from '.';

export default {
  component: ZUIEllipsisMenu,
  title: 'Atoms/ZUIEllipsisMenu',
} as ComponentMeta<typeof ZUIEllipsisMenu>;

const Template: ComponentStory<typeof ZUIEllipsisMenu> = (args) => (
  <ZUIEllipsisMenu items={args.items} />
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
