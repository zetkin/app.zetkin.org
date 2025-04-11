import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';

import ZUISection from './index';
import ZUIText from '../ZUIText';

const meta: Meta<typeof ZUISection> = {
  component: ZUISection,
  title: 'Components/ZUISection',
};
export default meta;

type Story = StoryObj<typeof ZUISection>;

export const Basic: Story = {
  args: {
    renderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
        <ZUIText>Content</ZUIText>
      </Box>
    ),
    title: 'Activists',
  },
};

export const WithSubtitle: Story = {
  args: {
    renderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
        <ZUIText>Content</ZUIText>
      </Box>
    ),
    subtitle: 'There are 5 new people in this section',
    title: 'Activists',
  },
};

export const DataPoint: Story = {
  args: {
    dataPoint: 2343,
    renderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
        <ZUIText>Content</ZUIText>
      </Box>
    ),
    subtitle: 'The numbers are up to date',
    title: 'Every household that we need to keep track of in this assignment',
  },
};

export const RightHeaderContent: Story = {
  args: {
    renderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
        <ZUIText>Content</ZUIText>
      </Box>
    ),
    renderRightHeaderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff' }}>
        <ZUIText>Right header content</ZUIText>
      </Box>
    ),
    subtitle: 'The numbers are up to date',
    title:
      'Every household that we need to keep track of in this assignment and some more information',
  },
};

export const RightHeaderContentAndDataPoint: Story = {
  args: {
    dataPoint: 235,
    renderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
        <ZUIText>Content</ZUIText>
      </Box>
    ),
    renderRightHeaderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff' }}>
        <ZUIText>Right header content</ZUIText>
      </Box>
    ),
    subtitle: 'The numbers are up to date',
    title:
      'Every household that we need to keep track of in this assignment and some more information',
  },
};

export const FullWidthHeaderContent: Story = {
  args: {
    renderContent: () => (
      <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
        <ZUIText>Content</ZUIText>
      </Box>
    ),
    renderFullWidthHeaderContent: () => (
      <Box
        sx={{
          backgroundColor: 'peachpuff',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ZUIText>Full width header content</ZUIText>
      </Box>
    ),
    subtitle: '5 activists, 24 areas',
    title: 'Statistics of the assignment',
  },
};

export const SubSections: Story = {
  args: {
    renderFullWidthHeaderContent: () => (
      <Box
        sx={{
          backgroundColor: 'peachpuff',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ZUIText>Full width header content</ZUIText>
      </Box>
    ),
    subSections: [
      {
        renderContent: () => (
          <Box sx={{ backgroundColor: 'lightsteelblue', height: '200px' }}>
            <ZUIText>Content here</ZUIText>
          </Box>
        ),
        subtitle:
          'These are people that are currently not in the que to be called.',
        title: 'Blocked from being called',
      },
      {
        renderContent: () => (
          <Box sx={{ backgroundColor: 'lightsteelblue', height: '100px' }}>
            <ZUIText>Content here</ZUIText>
          </Box>
        ),
        renderRightHeaderContent: () => (
          <Box
            sx={{
              backgroundColor: 'lightskyblue',
              height: '30px',
              width: '50px',
            }}
          />
        ),
        subtitle: 'They are waiting to get your call',
        title: 'Ready to be called in this assignment',
      },
      {
        renderContent: () => (
          <Box sx={{ backgroundColor: 'lightsteelblue', height: '300px' }}>
            <ZUIText>Content here</ZUIText>
          </Box>
        ),
        renderFullWidthHeaderContent: () => (
          <Box
            sx={{
              backgroundColor: 'lightskyblue',
              height: '10px',
              width: '100%',
            }}
          />
        ),
        title: 'Done',
      },
    ],
    subtitle: 'The statistics are re-calculated every time a call is made',
    title:
      'The statistics of the situation of the call assignment as it is currently',
  },
};

export const VerticalWithSubSections: Story = {
  args: {
    renderFullWidthHeaderContent: () => (
      <Box
        sx={{
          backgroundColor: 'peachpuff',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ZUIText>Full width header content</ZUIText>
      </Box>
    ),
    subSectionOrientation: 'vertical',
    subSections: [
      {
        renderContent: () => (
          <Box sx={{ backgroundColor: 'lightsteelblue', height: '200px' }}>
            <ZUIText>Content here</ZUIText>
          </Box>
        ),
        subtitle: 'Subtitle is long but not super super long',
        title: 'Sub componente Marcos',
      },
      {
        renderContent: () => (
          <Box sx={{ backgroundColor: 'lightsteelblue', height: '100px' }}>
            <ZUIText>Content here</ZUIText>
          </Box>
        ),
        renderRightHeaderContent: () => (
          <Box
            sx={{
              backgroundColor: 'lightskyblue',
              height: '30px',
              width: '50px',
            }}
          />
        ),
        subtitle: 'Subtitle is a bit shorter',
        title: 'Sub componente Marcos very longggg',
      },
      {
        renderContent: () => (
          <Box sx={{ backgroundColor: 'lightsteelblue', height: '300px' }}>
            <ZUIText>Content here</ZUIText>
          </Box>
        ),
        renderFullWidthHeaderContent: () => (
          <Box
            sx={{
              backgroundColor: 'lightskyblue',
              height: '10px',
              width: '100%',
            }}
          />
        ),
        title: 'Sub componente Marcos3',
      },
    ],
    subtitle: 'Subtitle',
    title: 'Section',
  },
};
