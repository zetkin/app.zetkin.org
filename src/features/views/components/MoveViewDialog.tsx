import { range } from 'lodash';
import { FunctionComponent } from 'react';
import { Close, Folder, SubdirectoryArrowRight } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  List,
  ListItem,
  useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';

import { useNumericRouteParams } from 'core/hooks';
import theme from 'theme';
import ZUIFuture from 'zui/ZUIFuture';
import { ZetkinViewFolder } from './types';
import { ViewBrowserItem } from '../hooks/useViewBrowserItems';
import useViewBrowserMutations from '../hooks/useViewBrowserMutations';
import useViewTree from '../hooks/useViewTree';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type FolderInsideTreeStructure = {
  folder: ZetkinViewFolder;
  insideMovedItem: boolean;
  nestingLevel: number;
};

/** For each subfolder of `id`, add it to the list, followed by its subfolders (and their subfolders, recursively), creating a tree-like structure */
const sortFoldersByTreeStructureRecursive = (
  id: number | null,
  nestingLevel: number,
  folderToMove: number | null,
  alreadyInsideMovedItem: boolean,
  allFolders: ZetkinViewFolder[]
): FolderInsideTreeStructure[] => {
  // Find all subfolders and sort them alphabetically
  const subfolders = allFolders
    .filter((f) => f.parent?.id == id)
    .sort((a, b) => a.title.localeCompare(b.title));

  return subfolders.flatMap((folder) => {
    // We cannot move a folder inside itself, or inside one of its children (or their children, recursively)
    // This condition makes it so that once we have encountered the folder-to-be-moved, we keep passing `true` all the way down the recursive tree
    const insideMovedItem = alreadyInsideMovedItem || folder.id == folderToMove;
    return [
      {
        folder,
        insideMovedItem,
        nestingLevel,
      },
      ...sortFoldersByTreeStructureRecursive(
        folder.id,
        nestingLevel + 1,
        folderToMove,
        insideMovedItem,
        allFolders
      ),
    ];
  });
};

const sortFoldersByTreeStructure = (
  itemToMove: number | null,
  allFolders: ZetkinViewFolder[]
): FolderInsideTreeStructure[] => {
  return sortFoldersByTreeStructureRecursive(
    null,
    0,
    itemToMove,
    false,
    allFolders
  );
};

export type MoveViewDialogProps = {
  close: () => void;
  itemToMove: ViewBrowserItem;
};
const MoveViewDialog: FunctionComponent<MoveViewDialogProps> = ({
  close,
  itemToMove,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const itemsFuture = useViewTree(orgId);

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { moveItem } = useViewBrowserMutations(orgId);

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
    >
      <DialogContent>
        <Box display="flex" justifyContent="space-between">
          <DialogTitle variant="h5">
            {messages.moveViewDialog.title({ itemName: itemToMove.title })}
          </DialogTitle>

          <IconButton onClick={close}>
            <Close color="secondary" />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column" rowGap={1}>
          <ZUIFuture future={itemsFuture}>
            {(data) => {
              const treeified = sortFoldersByTreeStructure(
                itemToMove.type == 'folder' ? itemToMove.data.id : null,
                data.folders
              );

              return (
                <>
                  <Button onClick={() => doMove(null)} variant="outlined">
                    {messages.moveViewDialog.moveToRoot()}
                  </Button>
                  <Box>
                    <List>
                      {treeified.map(
                        ({ nestingLevel, folder, insideMovedItem }) => {
                          return (
                            <ListItem key={folder.id}>
                              <Box
                                alignItems="center"
                                display="flex"
                                width="100%"
                              >
                                <Box
                                  alignItems="flex-start"
                                  display="flex"
                                  marginRight={2}
                                >
                                  {nestingLevel > 0 && (
                                    <>
                                      {range(nestingLevel - 1).map((idx) => (
                                        <Icon key={idx} />
                                      ))}
                                      <SubdirectoryArrowRight />
                                    </>
                                  )}
                                  <Folder />
                                </Box>

                                <Box
                                  alignItems="center"
                                  display="flex"
                                  flexGrow={1}
                                  marginRight={2}
                                >
                                  {folder.title}
                                </Box>

                                <Box alignItems="center" display="flex">
                                  {folder.id == itemToMove.folderId ? (
                                    <Button disabled variant="outlined">
                                      {messages.moveViewDialog.alreadyInThisFolder()}
                                    </Button>
                                  ) : insideMovedItem ? (
                                    <Button disabled variant="outlined">
                                      {messages.moveViewDialog.cannotMoveHere()}
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() => doMove(folder.id)}
                                      variant="outlined"
                                    >
                                      {messages.moveViewDialog.moveHere()}
                                    </Button>
                                  )}
                                </Box>
                              </Box>
                            </ListItem>
                          );
                        }
                      )}
                    </List>
                  </Box>
                </>
              );
            }}
          </ZUIFuture>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MoveViewDialog;
