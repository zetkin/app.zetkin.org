import { useContext } from 'react';

import messageIds from '../../calendar/l10n/messageIds';
import { resetSelection } from '../store';
import useEventsMutations from '../hooks/useEventsMutations';
import { useMessages } from 'core/i18n';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import {
  useAppDispatch,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';

const SelectionBarEllipsis = () => {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const handleDeselect = () => {
    dispatch(resetSelection());
  };

  const selectedEventIds = useAppSelector(
    (state) => state.events.selectedEventIds
  );

  const events = useAppSelector((state) => state.events.eventList.items);

  const unpublishedEvents = events.filter((event) =>
    selectedEventIds.some(
      (selectedEvent) =>
        selectedEvent == event.id && event.data?.published === null
    )
  );

  const publishedEvents = events.filter((event) =>
    selectedEventIds.some(
      (selectedEvent) => selectedEvent == event.id && event.data?.published
    )
  );

  const { orgId } = useNumericRouteParams();

  const { deleteEvents, updateEvents } = useEventsMutations(orgId);

  const ellipsisMenuItems = [
    {
      label: messages.selectionBar.ellipsisMenu.delete(),
      onSelect: () => {
        showConfirmDialog({
          onSubmit: () => {
            deleteEvents(selectedEventIds);
            handleDeselect();
          },
          title: messages.selectionBar.ellipsisMenu.confirmDelete(),
          warningText: messages.selectionBar.ellipsisMenu.deleteWarning(),
        });
      },
      textColor: '#ed1c55',
    },
    {
      divider: true,
      label: messages.selectionBar.ellipsisMenu.cancel(),
      onSelect: () => {
        showConfirmDialog({
          onSubmit: () => {
            updateEvents(selectedEventIds, false, true);
          },
          title: messages.selectionBar.ellipsisMenu.confirmCancel(),
          warningText: messages.selectionBar.ellipsisMenu.cancelWarning(),
        });
      },
      textColor: '#ed1c55',
    },
    // {
    //   label: messages.selectionBar.ellipsisMenu.print(),
    //   /* eslint-disable-next-line */
    //   onSelect: () => {},
    // },
  ];

  if (publishedEvents.length > 0) {
    ellipsisMenuItems.splice(2, 0, {
      label: messages.selectionBar.ellipsisMenu.unpublish(),
      onSelect: () => {
        updateEvents(selectedEventIds, false, false);
      },
      textColor: '#f66000',
    });
  }

  if (unpublishedEvents.length > 0) {
    ellipsisMenuItems.splice(publishedEvents.length > 0 ? 3 : 2, 0, {
      label: messages.selectionBar.ellipsisMenu.publish(),
      onSelect: () => {
        updateEvents(selectedEventIds, true, false);
      },
      textColor: '',
    });
  }

  return (
    <ZUIEllipsisMenu
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      items={ellipsisMenuItems}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
    />
  );
};

export default SelectionBarEllipsis;
