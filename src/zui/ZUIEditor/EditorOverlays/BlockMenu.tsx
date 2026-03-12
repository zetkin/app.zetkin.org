import { Box, MenuItem, Paper } from '@mui/material';
import { FC } from 'react';
import { UseMenuNavigationReturn } from '@remirror/react-hooks';

type Props = {
  filteredBlocks: {
    id: string;
    label: string;
  }[];
  menu: UseMenuNavigationReturn;
};

const BlockMenu: FC<Props> = ({ filteredBlocks, menu }) => {
  return (
    <Box {...menu.getMenuProps()} tabIndex={0}>
      <Paper>
        {filteredBlocks.map((item, index) => {
          const props = menu.getItemProps({ index, item });
          return (
            <MenuItem
              key={item.id}
              component="a"
              selected={menu.index === index}
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
