import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useStore } from 'react-redux';

import { EventsModel } from '../models/EventsModel';
import messageIds from '../../calendar/l10n/messageIds';
import { resetSelection } from '../store';
import { RootState } from 'core/store';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

const SelectionBarEllipsis = () => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const store = useStore<RootState>();

  const handleDeselect = () => {
    store.dispatch(resetSelection());
  };

  const selectedEventIds = useSelector(
    (state: RootState) => state.events.selectedEventIds
  );

  const events = useSelector(
    (state: RootState) => state.events.eventList.items
  );

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
  const router = useRouter();

  const orgId = router.query.orgId;
  const model = useModel(
    (env) => new EventsModel(env, parseInt(orgId as string))
  );

  const ellipsisMenuItems = [
    {
      label: messages.selectionBar.ellipsisMenu.delete(),
      onSelect: () => {
        showConfirmDialog({
          onSubmit: () => {
            model.deleteEvents(selectedEventIds);
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
            model.updateEvents(selectedEventIds, false, true);
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
        model.updateEvents(selectedEventIds, false, false);
      },
      textColor: '#f66000',
    });
  }

  if (unpublishedEvents.length > 0) {
    ellipsisMenuItems.splice(publishedEvents.length > 0 ? 3 : 2, 0, {
      label: messages.selectionBar.ellipsisMenu.publish(),
      onSelect: () => {
        model.updateEvents(selectedEventIds, true, false);
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
