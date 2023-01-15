import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Button } from '@mui/material';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';

import ViewBrowserModel from '../models/ViewBrowserModel';

interface ViewFolderActionButtonsProps {
  folderId: number | null;
  model: ViewBrowserModel;
}

const ViewFolderActionButtons: FC<ViewFolderActionButtonsProps> = ({
  folderId,
  model,
}) => {
  return (
    <Box display="flex" gap={1}>
      <Button endIcon={<FolderOutlined />} variant="outlined">
        <FormattedMessage id="pages.people.views.actions.createFolder" />
      </Button>
      <Button
        endIcon={<InsertDriveFileOutlined />}
        onClick={() => {
          model.createView(folderId || undefined);
        }}
        variant="contained"
      >
        <FormattedMessage id="pages.people.views.actions.createView" />
      </Button>
    </Box>
  );
};

export default ViewFolderActionButtons;
