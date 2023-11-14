import { ALERT_STATUS } from '../components/Importer/validation/importAlert';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface useStatusAlertStatesReturn {
  alertStatus: ALERT_STATUS;
  msg: string;
  title: string;
}

export default function useStatusAlertsStates(
  data: 'error' | 'completed' | 'scheduled'
): useStatusAlertStatesReturn {
  const message = useMessages(messageIds);

  if (data === 'error') {
    return {
      alertStatus: ALERT_STATUS.ERROR,
      msg: message.importStatus.error.desc(),
      title: message.importStatus.error.title(),
    };
  } else if (data === 'scheduled') {
    return {
      alertStatus: ALERT_STATUS.INFO,
      msg: message.importStatus.scheduled.desc(),
      title: message.importStatus.scheduled.title(),
    };
  } else {
    return {
      alertStatus: ALERT_STATUS.SUCCESS,
      msg: message.importStatus.completed.desc(),
      title: message.importStatus.completed.title(),
    };
  }
}
