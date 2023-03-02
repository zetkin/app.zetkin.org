import { makeStyles } from '@mui/styles';
import { Tab } from '@mui/material';
import { FC, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import ShareViewDialogDownloadTab from './ShareViewDialogDownloadTab';
import ShareViewDialogShareTab from './ShareViewDialogShareTab';
import { useMessages } from 'core/i18n';
import ViewSharingModel from 'features/views/models/ViewSharingModel';
import { ZetkinView } from '../types';
import ZUIDialog from 'zui/ZUIDialog';

import messageIds from 'features/views/l10n/messageIds';

interface ShareViewDialogProps {
  model: ViewSharingModel;
  onClose: () => void;
  view: ZetkinView;
}

const useStyles = makeStyles({
  tabPanel: {
    height: 'calc(100vh - 240px)',
    maxHeight: 600,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
});

const ShareViewDialog: FC<ShareViewDialogProps> = ({
  model,
  onClose,
  view,
}) => {
  const messages = useMessages(messageIds);
  const styles = useStyles();
  const [tab, setTab] = useState<'share' | 'download'>('share');

  return (
    <ZUIDialog
      maxWidth="md"
      onClose={onClose}
      open={true}
      title={messages.shareDialog.title({ title: view.title })}
    >
      <TabContext value={tab}>
        <TabList onChange={(ev, newValue) => setTab(newValue)} value={tab}>
          <Tab label="Share" value="share" />
          <Tab label="Download" value="download" />
        </TabList>
        <TabPanel className={styles.tabPanel} value="share">
          <ShareViewDialogShareTab model={model} />
        </TabPanel>
        <TabPanel className={styles.tabPanel} value="download">
          <ShareViewDialogDownloadTab onAbort={() => setTab('share')} />
        </TabPanel>
      </TabContext>
    </ZUIDialog>
  );
};

export default ShareViewDialog;
