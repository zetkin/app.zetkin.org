import { ALERT_STATUS } from '../components/ImportAlert';
import { FakeDataType } from '../components/Validation';
import messageIds from '../l10n/messageIds';
import useAlerts from './useAlerts';
import { useMessages } from 'core/i18n';

export default function useValidationStatusMessage(
  orgId: number,
  summary: FakeDataType['summary']
) {
  const messages = useMessages(messageIds);
  const { alerts } = useAlerts(summary, orgId);

  if (alerts.find((alert) => alert.status == ALERT_STATUS.ERROR)) {
    return messages.validation.statusMessages.error();
  }

  if (summary.peopleUpdated.total > 0 && summary.peopleCreated.total > 0) {
    return messages.validation.statusMessages.createAndUpdate({
      numCreated: summary.peopleCreated.total,
      numUpdated: summary.peopleUpdated.total,
    });
  }

  if (summary.peopleUpdated.total > 0 && summary.peopleCreated.total == 0) {
    return messages.validation.statusMessages.update({
      numUpdated: summary.peopleUpdated.total,
    });
  }

  if (summary.peopleUpdated.total == 0 && summary.peopleCreated.total > 0) {
    return messages.validation.statusMessages.create({
      numCreated: summary.peopleCreated.total,
    });
  }
}
