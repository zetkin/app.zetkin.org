import { useState } from 'react';

import { ALERT_STATUS } from '../components/ImportAlert';
import { FakeDataType } from '../components/Validation';
import messageIds from '../l10n/messageIds';
import useFieldTitle from './useFieldTitle';
import { useMessages } from 'core/i18n';
import {
  checkAllValuesAreZero,
  checkEmptyObj,
} from '../utils/getAddedOrgsSummary';

export interface Alert {
  msg: string;
  status: ALERT_STATUS;
  title: string;
}

interface UseAlertsReturn {
  alerts: Alert[];
  importDisabled: boolean;
  onCheckAlert: (index: number) => void;
}

export default function useAlerts(
  summary: FakeDataType['summary'],
  orgId: number
): UseAlertsReturn {
  const message = useMessages(messageIds);
  const getFieldTitle = useFieldTitle(orgId);
  const [approvedWarningAlerts, setApprovedWarningAlerts] = useState<number[]>(
    []
  );

  const alerts: Alert[] = [];

  const fieldsWithManyChanges = Object.entries(summary.peopleUpdated.byField)
    .filter((item) => {
      const fieldValue = item[1] as number;
      return summary.peopleUpdated.total * 0.2 < fieldValue;
    })
    .map((item) => item[0]);

  //TODO: use actual data to determine if id field was selected.
  const noIDFieldSelected = true;
  const emptyImport = checkEmptyObj(summary) || checkAllValuesAreZero(summary);

  //Error: nothing will be imported
  if (emptyImport) {
    alerts.push({
      msg: message.validation.alerts.error.desc(),
      status: ALERT_STATUS.ERROR,
      title: message.validation.alerts.error.title(),
    });
  }

  //Warning: No ID column was selected
  if (noIDFieldSelected) {
    alerts.push({
      msg: message.validation.alerts.warning.unselectedId.desc(),
      status: ALERT_STATUS.WARNING,
      title: message.validation.alerts.warning.unselectedId.title(),
    });
  }

  //Warning: unusual amount of changes to field/s
  if (fieldsWithManyChanges.length > 0) {
    fieldsWithManyChanges.forEach((fieldSlug) =>
      alerts.push({
        msg: message.validation.alerts.warning.manyChanges.desc(),
        status: ALERT_STATUS.WARNING,
        title: message.validation.alerts.warning.manyChanges.title({
          fieldName: getFieldTitle(fieldSlug),
        }),
      })
    );
  }

  //Success!
  if (!emptyImport && !noIDFieldSelected && fieldsWithManyChanges.length == 0) {
    alerts.push({
      msg: message.validation.alerts.info.desc(),
      status: ALERT_STATUS.INFO,
      title: message.validation.alerts.info.title(),
    });
  }

  const warningAlerts = alerts.filter(
    (alert) => alert.status == ALERT_STATUS.WARNING
  );
  const hasError =
    alerts.filter((item) => item.status == ALERT_STATUS.ERROR).length > 0;
  const allWarningsApproved =
    warningAlerts.length == approvedWarningAlerts.length;
  const hasSuccessMessage =
    alerts.filter((item) => item.status == ALERT_STATUS.INFO).length > 0;

  const importDisabled =
    (!allWarningsApproved || hasError) && !hasSuccessMessage;

  const onCheckAlert = (index: number) => {
    if (!approvedWarningAlerts.includes(index)) {
      const updatedAlerts = [...approvedWarningAlerts, index];
      setApprovedWarningAlerts(updatedAlerts);
    } else {
      const filteredAlerts = approvedWarningAlerts.filter(
        (item) => item !== index
      );
      setApprovedWarningAlerts(filteredAlerts);
    }
  };

  return { alerts, importDisabled, onCheckAlert };
}
