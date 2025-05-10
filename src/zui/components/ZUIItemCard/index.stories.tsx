import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import {
  Event,
  GroupWorkOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';

import ZUIItemCard from './index';
import ZUIButton from '../ZUIButton';
import ZUIIconLabel from '../ZUIIconLabel';
import ZUIText from '../ZUIText';

const meta: Meta<typeof ZUIItemCard> = {
  component: ZUIItemCard,
  title: 'Components/ZUIItemCard',
};
export default meta;

type Story = StoryObj<typeof ZUIItemCard>;

export const Basic: Story = {
  args: {
    actions: [
      <ZUIButton
        key="actionButton"
        label="See the full program"
        onClick={() => null}
        variant="primary"
      />,
    ],
    content:
      '20 events across 5 venues with presenters from Denmark, Bulgaria, Greece and France.',
    subtitle: 'March 5 - March 9',
    title: 'Feminist action week',
  },
  render: function Render(args) {
    return (
      <Box width="250px">
        <ZUIItemCard {...args} />
      </Box>
    );
  },
};

export const Avatar: Story = {
  args: {
    avatar: { firstName: 'Angela', id: 1, lastName: 'Davis' },
    content:
      'Angela has been a caller in 5 call assignments, attended 14 events and participated in 3 area assignments.',
    subtitle: 'Activist',
    title: 'Angela Davis',
  },
  render: Basic.render,
};

export const Icon: Story = {
  args: {
    content: 'October 5th, 13.00-15.00',
    icon: Event,
    subtitle: 'Meet-up for design volunteers',
    title: 'Design the future',
  },
  render: Basic.render,
};

export const ImageSrc: Story = {
  args: {
    actions: [
      <ZUIButton
        key="configureButton"
        label="Learn more"
        onClick={() => null}
        variant="primary"
      />,
    ],
    src: 'https://upload.wikimedia.org/wikipedia/commons/1/10/C_Zetkin_1.jpg',
    subtitle: 'Revolutionary, inspiration',
    title: 'Clara Zetkin',
  },
  render: Basic.render,
};

export const ImageElement: Story = {
  args: {
    actions: [
      <ZUIButton
        key="configureButton"
        label="Configure"
        onClick={() => null}
        variant="secondary"
      />,
    ],
    imageElement: <Box sx={{ backgroundColor: 'peachpuff', height: '100%' }} />,
    subtitle: 'Find people based on the surveys they responded to',
    title: 'Survey responses',
  },
  render: Basic.render,
};

export const ContentArray: Story = {
  args: {
    actions: [
      <ZUIButton
        key="configureButton"
        label="Sign up"
        onClick={() => null}
        variant="primary"
      />,
    ],
    content: [
      <ZUIIconLabel
        key="work"
        color="secondary"
        icon={GroupWorkOutlined}
        label={['Zetkin Foundation', 'Code Red coders']}
        noWrap
        size="small"
      />,
      '15.00-18.00',
      <ZUIIconLabel
        key="bla"
        color="secondary"
        icon={LocationOnOutlined}
        label="Södra förstadsgatan 33"
        noWrap
        size="small"
      />,
    ],
    icon: Event,
    title: 'Co-working for socialism',
  },
  render: Basic.render,
};

export const MultipleActions: Story = {
  args: {
    actions: [
      <ZUIButton
        key="signUpButton"
        label="Sign up"
        onClick={() => null}
        variant="secondary"
      />,
      <Box
        key="chip"
        sx={{
          bgcolor: '#FFE5C1',
          borderRadius: 4,
          color: '#f40',
          px: 1,
          py: 0.3,
        }}
      >
        <ZUIText variant="bodySmRegular">You are needed</ZUIText>
      </Box>,
    ],
    content: ['Coordinator: Angela', '17.00-20.00'],
    icon: Event,
    title: 'Hand out papers',
  },
  render: Basic.render,
};
