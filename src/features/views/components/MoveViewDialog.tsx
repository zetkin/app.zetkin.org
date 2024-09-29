import { FunctionComponent, useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  List,
  ListItem,
  useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@mui/styles';

import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';
import { ZetkinViewFolder } from './types';
import useViewBrowserItems, {
  ViewBrowserBackItem,
  ViewBrowserItem,
} from '../hooks/useViewBrowserItems';
import useViewBrowserMutations from '../hooks/useViewBrowserMutations';
import useViewTree from '../hooks/useViewTree';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import BrowserItemIcon from './ViewBrowser/BrowserItemIcon';
import { ViewTreeData } from 'pages/api/views/tree';

const folderById = (id: number | null, viewTree: ViewTreeData) => {
  if (id == null) {
    return null;
  }
  return viewTree.folders.find((f) => f.id == id) ?? null;
};

const getAllParentFolderIds = (
  folderId: number | null,
  viewTree: ViewTreeData
) => {
  let parentFolderIds: number[] = [];

  while (folderId != null) {
    parentFolderIds = [folderId, ...parentFolderIds];

    const folder = folderById(folderId, viewTree);
    folderId = folder?.parent?.id ?? null;
  }
  return parentFolderIds;
};

const MoveItemBreadcrumbs = ({
  onClickFolder,
  orgId,
  viewedFolder,
}: {
  onClickFolder: (folderId: number | null) => void;
  orgId: number;
  viewedFolder: number | null;
}) => {
  const messages = useMessages(messageIds);
  const viewTreeFuture = useViewTree(orgId);

  return (
    <ZUIFuture future={viewTreeFuture}>
      {(viewTree) => {
        const folders = getAllParentFolderIds(viewedFolder, viewTree)
          .map((id) => folderById(id, viewTree))
          .filter((folder): folder is ZetkinViewFolder => !!folder);

        // Add the root folder to the beginning
        const breadcrumbItems = [
          {
            id: null,
            title: messages.browserLayout.title(),
          },
          ...folders,
        ];
        return (
          <Breadcrumbs
            aria-label="breadcrumb"
            itemsAfterCollapse={2}
            itemsBeforeCollapse={1}
            maxItems={3}
            separator={<NavigateNextIcon fontSize="small" />}
          >
            {breadcrumbItems.map(({ title, id }) =>
              id == viewedFolder ? (
                <Box key={id ?? 'root'}>{title}</Box>
              ) : (
                <Link
                  key={id ?? 'root'}
                  color="inherit"
                  onClick={() => onClickFolder(id)}
                  sx={{ cursor: 'pointer' }}
                  underline="hover"
                >
                  {title}
                </Link>
              )
            )}
          </Breadcrumbs>
        );
      }}
    </ZUIFuture>
  );
};

type MoveViewDialogProps = {
  close: () => void;
  itemToMove: ViewBrowserItem;
};
const MoveViewDialog: FunctionComponent<MoveViewDialogProps> = ({
  close,
  itemToMove,
}) => {
  const [viewedFolder, setViewedFolder] = useState(itemToMove.folderId);

  const { orgId } = useNumericRouteParams();
  const itemsFuture = useViewBrowserItems(orgId, viewedFolder);
  const viewTreeFuture = useViewTree(orgId);
  const { moveItem } = useViewBrowserMutations(orgId);

  const messages = useMessages(messageIds);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (itemToMove.type == 'back') {
    throw new Error('Should not be possible to move a back button');
  }

  const doMove = (folderId: number | null) => {
    moveItem(itemToMove.type, itemToMove.data.id, folderId);
    close();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={close}
      open={true}
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '600px',
        },
      }}
      scroll="paper"
    >
      <DialogTitle>
        <MoveItemBreadcrumbs
          onClickFolder={setViewedFolder}
          orgId={orgId}
          viewedFolder={viewedFolder}
        />
      </DialogTitle>

      <DialogContent>
        <ZUIFuture future={itemsFuture}>
          {(data) => {
            const relevantItems = data.filter(
              (item): item is Exclude<typeof item, ViewBrowserBackItem> =>
                item.type != 'back'
            );
            if (relevantItems.length == 0) {
              return (
                <List>
                  <ListItem
                    sx={{
                      color: theme.palette.onSurface.disabled,
                    }}
                  >
                    {messages.moveViewDialog.emptyFolder()}
                  </ListItem>
                </List>
              );
            }
            return (
              <List>
                {relevantItems.map((item) => {
                  const {
                    data: { id },
                    title,
                    type,
                  } = item;

                  return (
                    <ListItem
                      key={`${type}-${id}`}
                      onClick={
                        type == 'folder' ? () => setViewedFolder(id) : undefined
                      }
                      sx={
                        type == 'folder'
                          ? { cursor: 'pointer' }
                          : {
                              color: theme.palette.onSurface.disabled,
                            }
                      }
                    >
                      <Box alignItems="center" display="flex" width="100%">
                        <Box
                          alignItems="flex-start"
                          display="flex"
                          marginRight={2}
                        >
                          <BrowserItemIcon item={item} />
                        </Box>

                        <Box
                          alignItems="center"
                          display="flex"
                          flexGrow={1}
                          marginRight={2}
                        >
                          {type == 'folder' ? (
                            <Link color="inherit" underline="hover">
                              {title}
                            </Link>
                          ) : (
                            title
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            );
          }}
        </ZUIFuture>
      </DialogContent>
      <ZUIFuture future={viewTreeFuture}>
        {(viewTree) => {
          const tryingToMoveFolderIntoItself =
            itemToMove.type == 'folder' &&
            getAllParentFolderIds(viewedFolder, viewTree).some(
              (id) => id == itemToMove.data.id
            );
          return (
            <DialogActions>
              <Button onClick={close} variant="outlined">
                {messages.moveViewDialog.cancel()}
              </Button>
              <Button
                disabled={tryingToMoveFolderIntoItself}
                onClick={() => doMove(viewedFolder)}
                variant="contained"
              >
                {messages.moveViewDialog.moveHere()}
              </Button>
            </DialogActions>
          );
        }}
      </ZUIFuture>
    </Dialog>
  );
};

export default MoveViewDialog;
