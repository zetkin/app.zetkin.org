import { useState } from 'react';

import { ALERT_STATUS } from '../components/ImportDialog/Steps/ImportAlert';
import { importResultAdd } from '../store';
import messageIds from '../l10n/messageIds';
import useFieldTitle from '../../../utils/hooks/useFieldTitle';
import { useMessages } from 'core/i18n';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import getAddedOrgsSummary, {
  checkAllValuesAreZero,
  checkEmptyObj,
} from '../utils/getAddedOrgsSummary';
import {
  IMPORT_ERROR,
  PersonImport,
  ZetkinPersonImportPostBody,
} from '../utils/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export interface Alert {
  msg: string;
  status: ALERT_STATUS;
  title: string;
}

export default function usePreflight(orgId: number) {
  const apiClient = useApiClient();
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const importOperations = useAppSelector(
    (state) => state.import.importOperations
  );
  const importErrors = useAppSelector((state) => state.import.importErrors);
  const preflightSummary = useAppSelector(
    (state) => state.import.preflightSummary
  );
  const [approvedWarningAlerts, setApprovedWarningAlerts] = useState<number[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const tags = useTags(orgId).data ?? [];
  const organizations = useOrganizations().data ?? [];
  const getFieldTitle = useFieldTitle(orgId);

  const { addedToOrg, tagged } = preflightSummary;

  const addedTags = Object.keys(tagged.byTag).reduce((acc: ZetkinTag[], id) => {
    const tag = tags.find((tag) => tag.id === parseInt(id));
    if (tag) {
      return acc.concat(tag);
    }
    return acc;
  }, []);

  const addedOrgsSummary = getAddedOrgsSummary(addedToOrg);
  const orgsWithNewPeople = organizations.filter((organization) =>
    addedOrgsSummary.orgs.some((orgId) => orgId == organization.id.toString())
  );

  const alerts: Alert[] = [];

  const fieldsWithManyChanges = Object.entries(preflightSummary.updated.byField)
    .filter((item) => {
      const fieldValue = item[1] as number;
      return preflightSummary.updated.total * 0.2 < fieldValue;
    })
    .map((item) => item[0]);

  const noIDFieldSelected = importErrors.includes(IMPORT_ERROR.ID_MISSING);
  const emptyImport =
    importErrors.length == 0 &&
    (checkEmptyObj(preflightSummary) ||
      checkAllValuesAreZero(preflightSummary));

  //Errors from forseeErrors (no API-call was made)
  importErrors.forEach((error) => {
    if (error != IMPORT_ERROR.ID_MISSING) {
      alerts.push({
        msg: messages.validation.alerts.errors.messages[error](),
        status: ALERT_STATUS.ERROR,
        title: messages.validation.alerts.errors.titles[error](),
      });
    }
  });

  //Error: API call was made, but nothing will be imported
  if (emptyImport) {
    alerts.push({
      msg: messages.validation.alerts.errors.messages['empty'](),
      status: ALERT_STATUS.ERROR,
      title: messages.validation.alerts.errors.titles['empty'](),
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
  if (
    !emptyImport &&
    !noIDFieldSelected &&
    fieldsWithManyChanges.length == 0 &&
    importErrors.length == 0
  ) {
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
    preflightSummary.updated.total > 0 &&
    preflightSummary.created.total > 0
  ) {
    statusMessage = messages.validation.statusMessages.createAndUpdate({
      numCreated: preflightSummary.updated.total,
      numUpdated: preflightSummary.updated.total,
    });
  } else if (
    preflightSummary.updated.total > 0 &&
    preflightSummary.created.total == 0
  ) {
    statusMessage = messages.validation.statusMessages.update({
      numUpdated: preflightSummary.updated.total,
    });
  } else if (
    preflightSummary.updated.total == 0 &&
    preflightSummary.created.total > 0
  ) {
    statusMessage = messages.validation.statusMessages.create({
      numCreated: preflightSummary.created.total,
    });
  }

  const importPeople = async () => {
    setLoading(true);

    const importResult = await apiClient.post<
      PersonImport,
      ZetkinPersonImportPostBody
    >(`/api/orgs/${orgId}/bulk/execute`, {
      ops: importOperations,
    });

    dispatch(importResultAdd(importResult));
    setLoading(false);
  };

  return {
    addedTags,
    alerts,
    importDisabled,
    importPeople,
    loading,
    onCheckAlert,
    orgsWithNewPeople,
    statusMessage,
    summary: preflightSummary,
  };
}
