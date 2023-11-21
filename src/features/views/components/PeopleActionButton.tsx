import { Box, Dialog, IconButton, Typography } from '@mui/material';
import {
  Close,
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';
import { FC, useState } from 'react';

import { addFile } from 'features/import/store';
import { ColumnKind } from 'features/import/utils/types';
import Importer from 'features/import/components/Importer';
import messageIds from '../l10n/messageIds';
import UploadFile from 'features/import/components/UploadFile';
import { useAppDispatch } from 'core/hooks';
import useCreateView from '../hooks/useCreateView';
import useFolder from '../hooks/useFolder';
import { useMessages } from 'core/i18n';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';

interface PeopleActionButtonProps {
  folderId: number | null;
  orgId: number;
}

const PeopleActionButton: FC<PeopleActionButtonProps> = ({
  folderId,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const [importerDialogOpen, setImporterDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const createView = useCreateView(orgId);
  const { createFolder } = useFolder(orgId, folderId);
  const dispatch = useAppDispatch();
  return (
    <Box>
      <ZUIButtonMenu
        items={[
          {
            icon: <InsertDriveFileOutlined />,
            label: messages.actions.createView(),
            onClick: () => {
              createView(folderId || undefined);
            },
          },
          {
            icon: <FolderOutlined />,
            label: messages.actions.createFolder(),
            onClick: () => {
              createFolder(messages.newFolderTitle(), folderId || undefined);
            },
          },
          {
            icon: <UploadFileOutlined />,
            label: 'importer', //messages.actions.importPeople(),
            onClick: () => {
              setImporterDialogOpen(true);
              dispatch(
                addFile({
                  selectedSheetIndex: 0,
                  sheets: [
                    {
                      columns: [
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                      ],
                      firstRowIsHeaders: true,
                      rows: [
                        {
                          data: ['Name', 'Last name', 'Email', 'Age', 'Pet'],
                        },
                        {
                          data: [
                            'Angela',
                            'Davies',
                            'angela@gmail.com',
                            34,
                            'Rabbit',
                          ],
                        },
                        {
                          data: ['Maya', 'Angelou', 'maya@gmail.com', 66, null],
                        },
                        {
                          data: ['Rosa', 'Parks', 'rosa@gmail.com', 81, 'Cat'],
                        },
                        {
                          data: [
                            'Huey',
                            'P Newton',
                            'huey@gmail.com',
                            51,
                            'Tortoise',
                          ],
                        },
                        {
                          data: [
                            'Huey',
                            'P Newton',
                            'huey@gmail.com',
                            51,
                            'Parrot',
                          ],
                        },
                        {
                          data: [
                            'Huey',
                            'P Newton',
                            'huey@gmail.com',
                            51,
                            'Cow',
                          ],
                        },
                        {
                          data: [
                            'Huey',
                            'P Newton',
                            'huey@gmail.com',
                            51,
                            'Dog',
                          ],
                        },
                      ],
                      title: 'Members',
                    },
                    {
                      columns: [
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                        {
                          kind: ColumnKind.UNKNOWN,
                          selected: false,
                        },
                      ],
                      firstRowIsHeaders: true,
                      rows: [
                        {
                          data: ['Name', 'Last name', 'Email', 'Age'],
                        },
                        {
                          data: ['Kitty', 'Jonsson', 'kitty@gmail.com', 36],
                        },
                        {
                          data: ['Lasse', 'Brandeby', 'lasse@gmail.com', 81],
                        },
                        {
                          data: ['Pamela', 'Andersson', 'pamela@gmail.com', 61],
                        },
                        {
                          data: ['Jane', 'Austen', 'jane@gmail.com', 102],
                        },
                      ],
                      title: 'Old Members',
                    },
                  ],
                  title: 'Excel file',
                })
              );
            },
          },
          {
            icon: <UploadFileOutlined />,
            label: 'upload', //messages.actions.importPeople(),
            onClick: () => setUploadDialogOpen(true),
          },
        ]}
        label={messages.actions.create()}
      />
      <Dialog
        onClose={() => setUploadDialogOpen(false)}
        open={uploadDialogOpen}
      >
        <Typography sx={{ fontSize: 32, padding: 2 }}>
          {messages.actions.importPeople()}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => setUploadDialogOpen(false)}
          sx={{
            color: (theme) => theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
        <UploadFile />
      </Dialog>
      <Importer
        onClose={() => setImporterDialogOpen(false)}
        onRestart={() => setImporterDialogOpen(false)}
        open={importerDialogOpen}
      />
    </Box>
  );
};

export default PeopleActionButton;
