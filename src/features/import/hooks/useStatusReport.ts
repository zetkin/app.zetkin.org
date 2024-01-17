import { ALERT_STATUS } from '../components/ImportDialog/elements/ImportAlert';
import messageIds from '../l10n/messageIds';
import { useAppSelector } from 'core/hooks';
import { useMessages } from 'core/i18n';

interface Alert {
  status: ALERT_STATUS;
  msg: string;
  title: string;
}

export default function useStatusReport() {
  const message = useMessages(messageIds);
  const importResult = useAppSelector((state) => state.import.importResult);

  if (!importResult) {
    throw new Error('No import result');
  }

  const summary = importResult.report.person.summary;

  let alert: Alert;

  if (!importResult.status || importResult.status === 'error') {
    alert = {
      msg: message.importStatus.error.desc(),
      status: ALERT_STATUS.ERROR,
      title: message.importStatus.error.title(),
    };
  } else if (
    importResult.status === 'pending' ||
    importResult.status === 'in_progress'
  ) {
    alert = {
      msg: message.importStatus.scheduled.desc(),
      status: ALERT_STATUS.INFO,
      title: message.importStatus.scheduled.title(),
    };
  } else {
    alert = {
      msg: message.importStatus.completed.desc(),
      status: ALERT_STATUS.SUCCESS,
      title: message.importStatus.completed.title(),
    };
  }

  return {
    alert,
    summary,
  };
}
