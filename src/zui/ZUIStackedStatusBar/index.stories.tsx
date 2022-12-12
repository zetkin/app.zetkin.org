import { useState } from '@storybook/addons';
import { Box, Button } from '@mui/material';

import ZUIStackedStatusBar from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIStackedStatusBar,
  title: 'ZUIStackedStatusBar',
} as ComponentMeta<typeof ZUIStackedStatusBar>;

const Template: ComponentStory<typeof ZUIStackedStatusBar> = () => {
  const [values, setValues] = useState([10, 10, 10]);
  const [colors, setColors] = useState([
    'rgba(245, 124, 0, 1)',
    'rgba(102, 187, 106, 1)',
    'rgba(25, 118, 210, 1)',
  ]);
  return (
    <Box>
      <Button
        onClick={() => {
          setValues([
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
          ]);
          setColors([
            'rgba(245, 124, 0, 1)',
            'rgba(102, 187, 106, 1)',
            'rgba(25, 118, 210, 1)',
          ]);
        }}
        variant="contained"
      >
        Change values
      </Button>
      <Button
        onClick={() => {
          setValues([1, 1, 1]);
          setColors([
            'rgba(0, 0, 0, 0.12)',
            'rgba(0, 0, 0, 0.12)',
            'rgba(0, 0, 0, 0.12)',
          ]);
        }}
        variant="contained"
      >
        Reset
      </Button>
      <ZUIStackedStatusBar colors={colors} values={values} />
    </Box>
  );
};

export const basic = Template.bind({});
