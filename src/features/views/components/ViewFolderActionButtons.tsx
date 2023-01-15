import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';

import ViewBrowserModel from '../models/ViewBrowserModel';

interface ViewFolderActionButtonsProps {
  folderId: number | null;
  model: ViewBrowserModel;
}

const ViewFolderActionButtons: FC<ViewFolderActionButtonsProps> = ({
  folderId,
  model,
}) => {
  const intl = useIntl();
  return (
    <Box display="flex" gap={1}>
      <Button
        endIcon={<FolderOutlined />}
        onClick={() => {
          model.createFolder(
            intl.formatMessage({ id: 'misc.views.newFolderTitle' }),
            folderId || undefined
          );
        }}
        variant="outlined"
      >
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
