import { ViewBrowserItem } from 'features/views/hooks/useViewBrowserItems';
import {
  ArrowBack,
  Folder,
  FolderOpen,
  InsertDriveFileOutlined,
} from '@mui/icons-material';
import { FC, useContext } from 'react';

import { BrowserRowContext } from './BrowserRow';

interface BrowserItemIconProps {
  item: ViewBrowserItem;
}

const BrowserItemIcon: FC<BrowserItemIconProps> = ({ item }) => {
  const dropProps = useContext(BrowserRowContext);
  if (item.type == 'folder') {
    return dropProps.active ? <FolderOpen /> : <Folder />;
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
