import { useState } from '@storybook/addons';
import { Box, Button } from '@mui/material';

import ZUIStackedStatusBar from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ZUIStackedStatusBar,
  title: 'ZUIStackedStatusBar',
} as ComponentMeta<typeof ZUIStackedStatusBar>;

const Template: ComponentStory<typeof ZUIStackedStatusBar> = (args) => {
  const [values, setValues] = useState([
    {
      color: 'rgba(245, 124, 0, 1)',
      value: 10,
    },
    {
      color: 'rgba(102, 187, 106, 1)',
      value: 10,
    },
    {
      color: 'rgba(25, 118, 210, 1)',
      value: 10,
    },
  ]);

  return (
    <Box>
      <Button
        onClick={() => {
          setValues(
            values.map((valueObj) => ({
              ...valueObj,
              value: Math.floor(Math.random() * 100),
            })),
          );
        }}
        variant="contained"
      >
        Change values
      </Button>
      <Button
        onClick={() => {
          setValues(
            values.map(() => ({
              color: 'rgba(0, 0, 0, 0.12)',
              value: 1,
            })),
          );
        }}
        variant="contained"
      >
        Reset
      </Button>
      <ZUIStackedStatusBar height={args.height} values={values} />
    </Box>
  );
};

export const basic = Template.bind({ height: 20 });
