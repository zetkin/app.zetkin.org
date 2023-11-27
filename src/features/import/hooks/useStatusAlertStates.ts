import { ALERT_STATUS } from '../components/ImportAlert';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface Alert {
  status: ALERT_STATUS;
  msg: string;
  title: string;
}

export default function useStatusAlertsStates(
  data: 'error' | 'completed' | 'scheduled'
): Alert {
  const message = useMessages(messageIds);

  if (data === 'error') {
    return {
      msg: message.importStatus.error.desc(),
      status: ALERT_STATUS.ERROR,
      title: message.importStatus.error.title(),
    };
  } else if (data === 'scheduled') {
    return {
      msg: message.importStatus.scheduled.desc(),
      status: ALERT_STATUS.INFO,
      title: message.importStatus.scheduled.title(),
    };
  } else {
    return {
      msg: message.importStatus.completed.desc(),
      status: ALERT_STATUS.SUCCESS,
      title: message.importStatus.completed.title(),
    };
  }
}
