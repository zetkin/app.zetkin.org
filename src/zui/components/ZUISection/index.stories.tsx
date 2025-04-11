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
    section: {
      renderContent: () => (
        <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
          <ZUIText>Content</ZUIText>
        </Box>
      ),
      title: 'Section',
    },
  },
};

export const WithSubtitle: Story = {
  args: {
    section: {
      renderContent: () => (
        <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
          <ZUIText>Content</ZUIText>
        </Box>
      ),
      subtitle: 'Subtitle',
      title: 'Section',
    },
  },
};

export const DataPoint: Story = {
  args: {
    section: {
      dataPoint: 2343,
      renderContent: () => (
        <Box sx={{ backgroundColor: 'peachpuff', height: '200px' }}>
          <ZUIText>Content</ZUIText>
        </Box>
      ),
      subtitle: 'Subtitle',
      title:
        'Section with a pretty long title maybe it is in Finnish or something',
    },
  },
};

export const RightHeaderContent: Story = {
  args: {
    section: {
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
      subtitle: 'Subtitle',
      title:
        'Section with a pretty long title maybe it is in Finnish or something',
    },
  },
};

export const RightHeaderContentAndDataPoint: Story = {
  args: {
    section: {
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
      subtitle: 'Subtitle',
      title:
        'Section with a pretty long title maybe it is in Finnish or something',
    },
  },
};

export const FullWidthHeaderContent: Story = {
  args: {
    section: {
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
      subtitle: 'Subtitle',
      title: 'Section with a title',
    },
  },
};

export const SubSections: Story = {
  args: {
    section: {
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
      title:
        'Section with a pretty long title maybe it is in Finnish or something',
    },
  },
};

export const VerticalWithSubSections: Story = {
  args: {
    section: {
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
  },
};
