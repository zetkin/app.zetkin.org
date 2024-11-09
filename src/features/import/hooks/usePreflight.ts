import { CountryCode } from 'libphonenumber-js';
import { useState } from 'react';

import { importResultAdd } from '../store';
import { levelForProblem } from '../utils/problems';
import messageIds from '../l10n/messageIds';
import { predictProblems } from '../utils/problems/predictProblems';
import prepareImportOperations from '../utils/prepareImportOperations';
import problemsFromPreview from '../utils/problems/problemsFromPreview';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useMessages } from 'core/i18n';
import useOrganization from 'features/organizations/hooks/useOrganization';
import { PersonImport, ZetkinPersonImportPostBody } from '../utils/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePreflight(orgId: number) {
  const apiClient = useApiClient();
  const messages = useMessages(messageIds);
  const dispatch = useAppDispatch();
  const selectedSheetIndex = useAppSelector(
    (state) => state.import.pendingFile.selectedSheetIndex
  );
  const sheet = useAppSelector(
    (state) => state.import.pendingFile.sheets[selectedSheetIndex]
  );
  const previewData = useAppSelector((state) => state.import.preflightSummary);

  const preflightSummary = previewData?.stats.person.summary;

  const [loading, setLoading] = useState(false);
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
    problems.push(
      ...problemsFromPreview(
        sheet.firstRowIsHeaders ? sheet.rows.length - 1 : sheet.rows.length,
        previewData
      )
    );
  }

  const rowModifier = sheet.firstRowIsHeaders ? 2 : 1;
  problems.map((problem) => {
    if ('indices' in problem) {
      problem.rows = problem.indices.map((index) => index + rowModifier);
    }
  });

  const hasError = problems.some(
    (problem) => levelForProblem(problem) == 'error'
  );

  const importDisabled = !allWarningsApproved || hasError;

  let statusMessage = '';

  if (hasError) {
    statusMessage = messages.validation.statusMessages.error();
  } else if (
    preflightSummary.updated.total > 0 &&
    preflightSummary.created.total > 0
  ) {
    statusMessage = messages.validation.statusMessages.createAndUpdate({
      numCreated: preflightSummary.created.total,
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
