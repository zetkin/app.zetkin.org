import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { CLUSTER_TYPE } from './MultiEventListItem';
import { EventState } from '../../models/EventDataModel';
import mockEvent from '../../../../utils/testing/mocks/mockEvent';
import MultiEventPopper from './MultiEventPopper';

export default {
  component: MultiEventPopper,
  title: 'MultiEventPopper',
} as ComponentMeta<typeof MultiEventPopper>;

const Template: ComponentStory<typeof MultiEventPopper> = (args) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <Box display="flex">
      <Button
        onClick={(evt) =>
          anchorEl ? setAnchorEl(null) : setAnchorEl(evt.currentTarget)
        }
      >
        Toggle open
      </Button>
      <MultiEventPopper
        anchorEl={anchorEl}
        clusterType={args.clusterType}
        events={args.events}
        open={Boolean(anchorEl)}
        state={args.state}
      />
    </Box>
  );
};

export const multiShift = Template.bind({});
multiShift.args = {
  clusterType: CLUSTER_TYPE.SHIFT,
  events: [
    {
      ...mockEvent(),
      contact: { id: 1, name: 'Clara Zetkin' },
      info_text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ex turpis, viverra sit amet consectetur eu, ' +
        'vestibulum vel nulla. Nunc tristique, tortor nec porttitor vulputate, nisi libero porttitor purus, vitae ' +
        'blandit sem nisl ut risus. In nulla metus, lobortis sed consectetur eu, porttitor et velit. Curabitur faucibus ' +
        'ex lacus, eget blandit libero molestie sed. Etiam dolor nisl, aliquam non elit eu, interdum ornare tellus. ' +
        'Morbi pharetra eu purus sit amet rutrum. Duis tincidunt augue at molestie mollis. Aliquam suscipit metus at ' +
        'venenatis porta. Quisque egestas malesuada dui nec fringilla. Maecenas condimentum metus mi. Quisque eleifend ' +
        'lorem eu sapien aliquet dapibus. Nunc sagittis dictum orci, ut molestie orci venenatis tincidunt. Sed non ' +
        'libero non nibh auctor cursus.',
    },
    mockEvent(),
  ],
  state: EventState.OPEN,
};
