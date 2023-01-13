import { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  FolderOutlined,
  InfoOutlined,
  InsertDriveFileOutlined,
} from '@mui/icons-material';

import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';

interface ViewFolderSubtitleProps {
  numFolders: number;
  numViews: number;
}

const ViewFolderSubtitle: FC<ViewFolderSubtitleProps> = ({
  numFolders,
  numViews,
}) => {
  const intl = useIntl();

  if (numFolders + numViews == 0) {
    return (
      <ZUIIconLabel
        icon={<InfoOutlined />}
        label={intl.formatMessage({ id: 'pages.people.folder.summary.empty' })}
      />
    );
  }

  return (
    <ZUIIconLabelRow
      iconLabels={[
        {
          icon: <FolderOutlined />,
          label: intl.formatMessage(
            { id: 'pages.people.folder.summary.folderCount' },
            { count: numFolders }
          ),
        },
        {
          icon: <InsertDriveFileOutlined />,
          label: intl.formatMessage(
            { id: 'pages.people.folder.summary.viewCount' },
            { count: numViews }
          ),
        },
      ]}
    />
  );
};

export default ViewFolderSubtitle;
