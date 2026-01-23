import { Tab } from '@mui/material';
import { FC, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import ShareViewDialogDownloadTab from './ShareViewDialogDownloadTab';
import ShareViewDialogShareTab from './ShareViewDialogShareTab';
import { useMessages } from 'core/i18n';
import { ZetkinView } from '../types';
import ZUIDialog from 'zui/ZUIDialog';
import messageIds from 'features/views/l10n/messageIds';

interface ShareViewDialogProps {
  onClose: () => void;
  view: ZetkinView;
}

const ShareViewDialog: FC<ShareViewDialogProps> = ({ onClose, view }) => {
  const messages = useMessages(messageIds);
  const [tab, setTab] = useState<'share' | 'download'>('share');

  const tabPanelStyles = {
    height: 'calc(100vh - 240px)',
    maxHeight: '600px',
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  };

  return (
    <ZUIDialog
      maxWidth="md"
      onClose={onClose}
      open={true}
      title={messages.shareDialog.title({ title: view.title })}
    >
      <TabContext value={tab}>
        <TabList onChange={(ev, newValue) => setTab(newValue)}>
          <Tab label={messages.shareDialog.share.tabLabel()} value="share" />
          <Tab
            label={messages.shareDialog.download.tabLabel()}
            value="download"
          />
        </TabList>
        <TabPanel sx={tabPanelStyles} value="share">
          <ShareViewDialogShareTab />
        </TabPanel>
        <TabPanel sx={tabPanelStyles} value="download">
          <ShareViewDialogDownloadTab onAbort={() => setTab('share')} />
        </TabPanel>
      </TabContext>
    </ZUIDialog>
  );
};

export default ShareViewDialog;
