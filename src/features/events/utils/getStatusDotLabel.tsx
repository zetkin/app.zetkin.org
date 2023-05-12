import { EventState } from '../models/EventDataModel';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { STATUS_COLORS } from 'features/campaigns/components/ActivityList/items/ActivityListItem';

export default function getStatusDotLabel({
  color,
  state,
}: {
  color?: STATUS_COLORS;
  state?: EventState;
}) {
  if (state) {
    if (state === EventState.OPEN) {
      return <Msg id={messageIds.eventStatus.open} />;
    } else if (state === EventState.ENDED) {
      return <Msg id={messageIds.eventStatus.ended} />;
    } else if (state === EventState.SCHEDULED) {
      return <Msg id={messageIds.eventStatus.scheduled} />;
    } else if (state === EventState.CANCELLED) {
      return <Msg id={messageIds.eventStatus.cancelled} />;
    } else if (state === EventState.DRAFT) {
      return <Msg id={messageIds.eventStatus.draft} />;
    } else {
      return <Msg id={messageIds.eventStatus.unknown} />;
    }
  }
  if (color) {
    if (color === STATUS_COLORS.GREEN) {
      return <Msg id={messageIds.eventStatus.open} />;
    } else if (color === STATUS_COLORS.RED) {
      return <Msg id={messageIds.eventStatus.ended} />;
    } else if (color === STATUS_COLORS.BLUE) {
      return <Msg id={messageIds.eventStatus.scheduled} />;
    } else if (color === STATUS_COLORS.ORANGE) {
      return <Msg id={messageIds.eventStatus.cancelled} />;
    } else if (color === STATUS_COLORS.GRAY) {
      return <Msg id={messageIds.eventStatus.draft} />;
    }
  }
}
