import { Box } from '@mui/material';
import { FC } from 'react';

import ViewSharingModel from 'features/views/models/ViewSharingModel';
import ZUIAccessList from 'zui/ZUIAccessList';
import ZUIFuture from 'zui/ZUIFuture';

interface ShareViewDialogShareTabProps {
  model: ViewSharingModel;
}

const ShareViewDialogShareTab: FC<ShareViewDialogShareTabProps> = ({
  model,
}) => {
  const accessFuture = model.getAccessList();
  return (
    <Box>
      <ZUIFuture future={accessFuture}>
        {(data) => <ZUIAccessList list={data} orgId={model.orgId} />}
      </ZUIFuture>
    </Box>
  );
};

export default ShareViewDialogShareTab;
