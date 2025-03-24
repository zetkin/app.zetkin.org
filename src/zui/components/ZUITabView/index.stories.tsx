import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ZUITabView from './index';

const meta: Meta<typeof ZUITabView> = {
  component: ZUITabView,
  title: 'Components/ZUITabView',
};
export default meta;

type Story = StoryObj<typeof ZUITabView>;

export const Basic: Story = {
  args: {},
  render: function Render(args) {
    //const [value, setValue] = useState('mjao');

    return (
      <ZUITabView
        items={[
          { content: <div>hallå</div>, label: 'Hej', value: 'goddag' },
          { content: <div>katt</div>, label: 'Katt', value: 'mjao' },
        ]}
        onChange={(newValue) => null}
        value={'mjao'}
      />
    );
  },
};
