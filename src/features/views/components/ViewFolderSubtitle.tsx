import { FC } from 'react';
import {
  FolderOutlined,
  InfoOutlined,
  InsertDriveFileOutlined,
} from '@mui/icons-material';

import { useMessages } from 'core/i18n';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';

import messageIds from '../l10n/messageIds';

interface ViewFolderSubtitleProps {
  numFolders: number;
  numViews: number;
}

const ViewFolderSubtitle: FC<ViewFolderSubtitleProps> = ({
  numFolders,
  numViews,
}) => {
  const messages = useMessages(messageIds);

  if (numFolders + numViews == 0) {
    return (
      <ZUIIconLabel
        icon={<InfoOutlined />}
        label={messages.folder.summary.empty()}
      />
    );
  }

  return (
    <ZUIIconLabelRow
      iconLabels={[
        {
          icon: <FolderOutlined />,
          label: messages.folder.summary.folderCount({ count: numFolders }),
        },
        {
          icon: <InsertDriveFileOutlined />,
          label: messages.folder.summary.viewCount({ count: numViews }),
        },
      ]}
    />
  );
};

export default ViewFolderSubtitle;
