import { ALERT_STATUS } from '../components/Importer/Validation/ImportAlert';
import { FakeDataType } from '../components/Importer/Validation';
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

export default function useAlerts(
  fake: FakeDataType['summary'],
  orgId: number
): Alert[] {
  const message = useMessages(messageIds);
  const getFieldTitle = useFieldTitle(orgId);

  const alerts: Alert[] = [];

  const fieldsWithManyChanges = Object.entries(fake.peopleUpdated.byField)
    .filter((item) => {
      const fieldValue = item[1] as number;
      return fake.peopleUpdated.total * 0.2 < fieldValue;
    })
    .map((item) => item[0]);

  //Error: nothing will be imported
  if (checkEmptyObj(fake) || checkAllValuesAreZero(fake)) {
    alerts.push({
      msg: message.validation.alerts.error.desc(),
      status: ALERT_STATUS.ERROR,
      title: message.validation.alerts.error.title(),
    });
  }
  //Warning when there are many changes to field
  else if (fieldsWithManyChanges.length > 0) {
    fieldsWithManyChanges.forEach((fieldSlug) =>
      alerts.push({
        msg: message.validation.alerts.warning.manyChanges.desc(),
        status: ALERT_STATUS.WARNING,
        title: message.validation.alerts.warning.manyChanges.title({
          fieldName: getFieldTitle(fieldSlug),
        }),
      })
    );
  } else {
    alerts.push({
      msg: message.validation.alerts.info.desc(),
      status: ALERT_STATUS.INFO,
      title: message.validation.alerts.info.title(),
    });
  }
  return alerts;
}
