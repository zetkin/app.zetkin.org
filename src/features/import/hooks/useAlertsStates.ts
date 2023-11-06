import { ALERT_STATUS } from '../components/Importer/validation/importAlert';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { isEmptyObj } from '../utils/getOrgsStates';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface FakeDataType {
  summary: {
    createdPeople: {
      appliedTagsCreated: { [key: number]: number };
      organizationMembershipsCreated: { [key: number]: number };
      total: number;
    };
    updatedPeople: {
      appliedTagsCreated: { [key: number]: number };
      appliedTagsUpdated: { [key: number]: number };
      fields: any;
      organizationMembershipsCreated: { [key: number]: number };
      total: number;
    };
  };
}

export default function useAlertsStates(
  fake: FakeDataType,
  onDisabled: (value: boolean) => void,
  onClickBack: () => void
) {
  const message = useMessages(messageIds);
  const globalMessages = useMessages(globalMessageIds);

  const result = [];

  const fieldsWithManyChanges = Object.entries(
    fake.summary.updatedPeople.fields
  )
    .filter((item) => {
      const fieldValue = item[1] as number;
      return fake.summary.updatedPeople.total * 0.2 < fieldValue;
    })
    .map((item) => item[0]);

  //Error when no one imported
  const allObjsAreEmpty =
    isEmptyObj(fake.summary.createdPeople.appliedTagsCreated) &&
    isEmptyObj(fake.summary.createdPeople.organizationMembershipsCreated) &&
    isEmptyObj(fake.summary.updatedPeople.appliedTagsCreated) &&
    isEmptyObj(fake.summary.updatedPeople.organizationMembershipsCreated) &&
    fake.summary.createdPeople.total === 0 &&
    fake.summary.updatedPeople.total === 0;

  if (allObjsAreEmpty) {
    onDisabled(true);
    result.push({
      alertStatus: ALERT_STATUS.ERROR,
      msg: message.validation.alerts.error.desc(),
      onBack: () => {
        onClickBack();
        onDisabled(false);
      },
      title: message.validation.alerts.error.title(),
    });
  }
  //Warning when there are many changes to field
  else if (fieldsWithManyChanges.length > 0) {
    fieldsWithManyChanges.forEach((item) =>
      result.push({
        alertStatus: ALERT_STATUS.WARNING,
        msg: message.validation.alerts.warning.manyChanges.desc(),
        title: message.validation.alerts.warning.manyChanges.title({
          fieldName:
            globalMessages.personFields[item as NATIVE_PERSON_FIELDS](),
        }),
      })
    );
  } else {
    result.push({
      alertStatus: ALERT_STATUS.INFO,
      msg: message.validation.alerts.info.desc(),
      title: message.validation.alerts.info.title(),
    });
  }

  return result;
}
