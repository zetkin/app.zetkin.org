import { Tab } from '@mui/material';
import { useIntl } from 'react-intl';
import { FC, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import ShareViewDialogShareTab from './ShareViewDialogShareTab';
import ViewSharingModel from 'features/views/models/ViewSharingModel';
import { ZetkinView } from '../types';
import ZUIDialog from 'zui/ZUIDialog';

interface ShareViewDialogProps {
  model: ViewSharingModel;
  onClose: () => void;
  view: ZetkinView;
}

const ShareViewDialog: FC<ShareViewDialogProps> = ({
  model,
  onClose,
  view,
}) => {
  const intl = useIntl();
  const [tab, setTab] = useState<'share' | 'download'>('share');

  return (
    <ZUIDialog
      maxWidth="md"
      onClose={onClose}
      open={true}
      title={intl.formatMessage(
        { id: 'pages.people.views.shareDialog.title' },
        { title: view.title }
      )}
    >
      <TabContext value={tab}>
        <TabList onChange={(ev, newValue) => setTab(newValue)} value={tab}>
          <Tab label="Share" value="share" />
          <Tab label="Download" value="download" />
        </TabList>
        <TabPanel value="share">
          <ShareViewDialogShareTab model={model} />
        </TabPanel>
        <TabPanel value="download"></TabPanel>
      </TabContext>
    </ZUIDialog>
  );
};

export default ShareViewDialog;
