import { CountryCode } from 'libphonenumber-js';
import { useState } from 'react';

import { ALERT_STATUS } from '../components/ImportDialog/elements/ImportAlert';
import { importResultAdd } from '../store';
import messageIds from '../l10n/messageIds';
import { predictProblems } from '../utils/problems/predictProblems';
import prepareImportOperations from '../utils/prepareImportOperations';
import problemsFromPreview from '../utils/problems/problemsFromPreview';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useFieldTitle from '../../../utils/hooks/useFieldTitle';
import { useMessages } from 'core/i18n';
import useOrganization from 'features/organizations/hooks/useOrganization';
import {
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
  const importErrors = useAppSelector((state) => state.import.importErrors);
  const selectedSheetIndex = useAppSelector(
    (state) => state.import.pendingFile.selectedSheetIndex
  );
  const sheet = useAppSelector(
    (state) => state.import.pendingFile.sheets[selectedSheetIndex]
  );
  const previewData = useAppSelector((state) => state.import.preflightSummary);

  const preflightSummary = previewData?.stats.person.summary;

  const [loading, setLoading] = useState(false);
  const getFieldTitle = useFieldTitle(orgId);
  const organization = useOrganization(orgId).data;
  const { data: fields } = useCustomFields(orgId);
  const [allWarningsApproved, setAllWarningsApproved] = useState(false);

  if (!organization) {
    return;
  }

  if (!fields) {
    return;
  }

  if (!preflightSummary) {
    throw new Error('No preflight summary');
  }

  const problems = predictProblems(
    sheet,
    organization.country.toString() as CountryCode,
    fields
  );

  if (problems.length == 0) {
    problems.push(...problemsFromPreview(previewData));
  }

  const alerts: Alert[] = [];

  const fieldsWithManyChanges = Object.entries(
    preflightSummary.updated.byChangedField
  )
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
        msg: messages.validation.alerts.errors[error].description(),
        status: ALERT_STATUS.ERROR,
        title: messages.validation.alerts.errors[error].title(),
      });
    }
  });

  //Error: API call was made, but nothing will be imported
  if (emptyImport) {
    alerts.push({
      msg: messages.validation.alerts.errors.empty.description(),
      status: ALERT_STATUS.ERROR,
      title: messages.validation.alerts.errors.empty.title(),
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

  const hasError =
    alerts.filter((item) => item.status == ALERT_STATUS.ERROR).length > 0;
  const hasSuccessMessage =
    alerts.filter((item) => item.status == ALERT_STATUS.INFO).length > 0;

  const importDisabled =
    (!allWarningsApproved || hasError) && !hasSuccessMessage;

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

    const importOperations = prepareImportOperations(
      sheet,
      organization.country as CountryCode
    );

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
    alerts,
    importDisabled,
    importPeople,
    loading,
    onAllChecked: (allChecked: boolean) => {
      setAllWarningsApproved(allChecked);
    },
    problems,
    statusMessage,
    summary: preflightSummary,
  };
}
