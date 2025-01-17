import { Box, MenuItem, Paper } from '@mui/material';
import { FC } from 'react';

import useBlockMenu from './useBlockMenu';

type Props = {
  blocks: {
    id: string;
    label: string;
  }[];
};

const BlockMenu: FC<Props> = ({ blocks }) => {
  const { filteredBlocks, menu } = useBlockMenu(blocks);

  return (
    <Box {...menu.getMenuProps()}>
      <Paper>
        {filteredBlocks.map((item, index) => {
          const props = menu.getItemProps({ index, item });
          return (
            <MenuItem
              key={item.id}
              component="a"
              selected={!!props['aria-current']}
              {...props}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Paper>
    </Box>
  );
};

export default BlockMenu;
