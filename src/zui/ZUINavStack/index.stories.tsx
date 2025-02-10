import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Box } from '@mui/material';

import ZUINavStack from '.';

export default {
  component: ZUINavStack,
  title: 'ZUINavStack',
} as Meta<typeof ZUINavStack>;

const Template: StoryFn<typeof ZUINavStack> = () => {
  const [curPage, setCurPage] = useState('first');
  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setCurPage('first')}>First page</button>
        <button onClick={() => setCurPage('second')}>Second page</button>
        <button onClick={() => setCurPage('third')}>Third page</button>
      </div>
      <div
        style={{
          border: '1px solid black',
          height: 640,
          overflow: 'hidden',
          width: 480,
        }}
      >
        <ZUINavStack bgcolor="white" currentPage={curPage}>
          <Box key="first" bgcolor="salmon" height="100%">
            First page.
          </Box>
          <Box key="second" bgcolor="lightblue" height="100%">
            Second page.
          </Box>
          <Box key="third" bgcolor="teal" height="100%">
            Third page.
          </Box>
        </ZUINavStack>
      </div>
    </>
  );
};

export const basic = Template.bind({});
basic.args = {};
