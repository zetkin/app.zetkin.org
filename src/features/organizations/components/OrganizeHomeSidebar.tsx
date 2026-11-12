import { FC, useState } from 'react';
import { Box, Drawer } from '@mui/material';

import SidebarUserFooter from 'zui/ZUIOrganizeSidebar/SidebarUserFooter';
import OrganizationSwitcher from './OrganizationSwitcher';
import OrganizationFilterField from './OrganizationSwitcher/OrganizationFilterField';

const drawerWidth = 300;

const OrganizeHomeSidebar: FC = () => {
  const [searchString, setSearchString] = useState('');

  return (
    <Drawer
      anchor="left"
      open
      sx={{
        '.MuiDrawer-paper': {
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          width: drawerWidth,
        },
        flexShrink: 0,
        width: drawerWidth,
      }}
      variant="permanent"
    >
      <Box mx={1} my={1.5}>
        <OrganizationFilterField
          onChange={setSearchString}
          value={searchString}
        />
      </Box>
      <Box sx={{ flexGrow: 1, overflowX: 'hidden', overflowY: 'auto' }}>
        <OrganizationSwitcher
          open
          searchString={searchString}
          variant="inline"
        />
      </Box>
      <SidebarUserFooter open />
    </Drawer>
  );
};

export default OrganizeHomeSidebar;
