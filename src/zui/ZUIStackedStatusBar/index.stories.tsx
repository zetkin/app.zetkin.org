import { useState } from '@storybook/preview-api';
import { Box, Button } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import ZUIStackedStatusBar from '.';

export default {
  component: ZUIStackedStatusBar,
  title: 'Old/ZUIStackedStatusBar',
} as Meta<typeof ZUIStackedStatusBar>;

const Template: StoryFn<typeof ZUIStackedStatusBar> = (args) => {
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
            }))
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
            }))
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
