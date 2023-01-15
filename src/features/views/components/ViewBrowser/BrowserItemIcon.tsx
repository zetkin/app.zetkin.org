import { FC } from 'react';
import {
  ArrowBack,
  Folder,
  InsertDriveFileOutlined,
} from '@mui/icons-material';

import { ViewBrowserItem } from 'features/views/models/ViewBrowserModel';

interface BrowserItemIconProps {
  item: ViewBrowserItem;
}

const BrowserItemIcon: FC<BrowserItemIconProps> = ({ item }) => {
  if (item.type == 'folder') {
    return <Folder />;
  } else if (item.type == 'back') {
    return <ArrowBack />;
  } else if (item.type == 'view') {
    return <InsertDriveFileOutlined />;
  } else {
    // Will never happen
    return null;
  }
};

export default BrowserItemIcon;
