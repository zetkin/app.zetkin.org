import { FC, useContext, useMemo } from 'react';

import ZUIEllipsisMenu, { MenuItem } from 'zui/ZUIEllipsisMenu';
import { useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';
import useFolder from 'features/views/hooks/useFolder';
import useViewMutations from 'features/views/hooks/useViewMutations';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { ViewBrowserItem } from 'features/views/hooks/useViewBrowserItems';

const BrowserEllipsisMenu: FC<{
  item: ViewBrowserItem;
  orgId: number;
  setItemToBeMoved: (item: ViewBrowserItem) => void;
  setItemToBeRenamed: (item: ViewBrowserItem) => void;
}> = ({ item, orgId, setItemToBeMoved, setItemToBeRenamed }) => {
  const messages = useMessages(messageIds);
  const { deleteFolder } = useFolder(orgId);
  const { deleteView, duplicateView } = useViewMutations(orgId);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const items: MenuItem[] = useMemo(() => {
    if (item.type !== 'folder' && item.type !== 'view') {
      return [];
    }

    return [
      {
        label: messages.browser.menu.rename(),
        onSelect: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setItemToBeRenamed(item);
        },
      },
      {
        id: 'delete-item',
        label: messages.browser.menu.delete(),
        onSelect: (e) => {
          e.stopPropagation();
          showConfirmDialog({
            onSubmit: () => {
              if (item.type == 'folder') {
                deleteFolder(item.data.id);
              } else if (item.type == 'view') {
                deleteView(item.data.id);
              }
            },
            title: messages.browser.confirmDelete[item.type].title(),
            warningText: messages.browser.confirmDelete[item.type].warning(),
          });
        },
      },
      {
        id: 'move-item',
        label: messages.browser.menu.move(),
        onSelect: (e) => {
          e.stopPropagation();
          setItemToBeMoved(item);
        },
      },
      {
        disabled: item.type != 'view',
        id: 'duplicate-item',
        label: messages.browser.menu.duplicate(),
        onSelect: (e) => {
          e.stopPropagation();
          duplicateView(
            item.data.id,
            item.folderId,
            messages.browser.menu.viewCopy({ viewName: item.title })
          );
        },
      },
    ];
  }, [
    deleteFolder,
    deleteView,
    duplicateView,
    item,
    messages.browser.confirmDelete,
    messages.browser.menu,
    setItemToBeMoved,
    setItemToBeRenamed,
    showConfirmDialog,
  ]);

  return <ZUIEllipsisMenu items={items} keepMounted={false} />;
};

export default BrowserEllipsisMenu;
