import { useState } from 'react';

import { ALERT_STATUS } from '../components/ImportAlert';
import { FakeDataType } from '../components/Validation';
import messageIds from '../l10n/messageIds';
import useFieldTitle from './useFieldTitle';
import { useMessages } from 'core/i18n';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import getAddedOrgsSummary, {
  checkAllValuesAreZero,
  checkEmptyObj,
} from '../utils/getAddedOrgsSummary';

export interface Alert {
  msg: string;
  status: ALERT_STATUS;
  title: string;
}

export default function useValidationStep(
  orgId: number,
  summary: FakeDataType['summary']
) {
  const messages = useMessages(messageIds);
  const [approvedWarningAlerts, setApprovedWarningAlerts] = useState<number[]>(
    []
  );
  const tags = useTags(orgId).data ?? [];
  const organizations = useOrganizations().data ?? [];
  const getFieldTitle = useFieldTitle(orgId);

  const { membershipsCreated, tagsCreated } = summary;

  const addedTags = Object.keys(tagsCreated.byTag).reduce(
    (acc: ZetkinTag[], id) => {
      const tag = tags.find((tag) => tag.id === parseInt(id));
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    },
    []
  );

  const addedOrgsSummary = getAddedOrgsSummary(membershipsCreated);
  const orgsWithNewPeople = organizations.filter((organization) =>
    addedOrgsSummary.orgs.some((orgId) => orgId == organization.id.toString())
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
      msg: messages.validation.alerts.error.desc(),
      status: ALERT_STATUS.ERROR,
      title: messages.validation.alerts.error.title(),
    });
  }

  //Warning: No ID column was selected
  if (noIDFieldSelected) {
    alerts.push({
      msg: messages.validation.alerts.warning.unselectedId.desc(),
      status: ALERT_STATUS.WARNING,
      title: messages.validation.alerts.warning.unselectedId.title(),
    });
  }

  //Warning: unusual amount of changes to field/s
  if (fieldsWithManyChanges.length > 0) {
    fieldsWithManyChanges.forEach((fieldSlug) =>
      alerts.push({
        msg: messages.validation.alerts.warning.manyChanges.desc(),
        status: ALERT_STATUS.WARNING,
        title: messages.validation.alerts.warning.manyChanges.title({
          fieldName: getFieldTitle(fieldSlug),
        }),
      })
    );
  }

  //Success!
  if (!emptyImport && !noIDFieldSelected && fieldsWithManyChanges.length == 0) {
    alerts.push({
      msg: messages.validation.alerts.info.desc(),
      status: ALERT_STATUS.INFO,
      title: messages.validation.alerts.info.title(),
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

  let statusMessage = '';

  if (alerts.find((alert) => alert.status == ALERT_STATUS.ERROR)) {
    statusMessage = messages.validation.statusMessages.error();
  } else if (
    summary.peopleUpdated.total > 0 &&
    summary.peopleCreated.total > 0
  ) {
    statusMessage = messages.validation.statusMessages.createAndUpdate({
      numCreated: summary.peopleCreated.total,
      numUpdated: summary.peopleUpdated.total,
    });
  } else if (
    summary.peopleUpdated.total > 0 &&
    summary.peopleCreated.total == 0
  ) {
    statusMessage = messages.validation.statusMessages.update({
      numUpdated: summary.peopleUpdated.total,
    });
  } else if (
    summary.peopleUpdated.total == 0 &&
    summary.peopleCreated.total > 0
  ) {
    statusMessage = messages.validation.statusMessages.create({
      numCreated: summary.peopleCreated.total,
    });
  }

  return {
    addedTags,
    alerts,
    importDisabled,
    onCheckAlert,
    orgsWithNewPeople,
    statusMessage,
  };
}
