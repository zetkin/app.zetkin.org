import { CountryCode } from 'libphonenumber-js';

import { importPreviewAdd } from '../store';
import { levelForProblem } from '../utils/problems';
import { predictProblems } from '../utils/problems/predictProblems';
import prepareImportOperations from '../utils/prepareImportOperations';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useOrganization from 'features/organizations/hooks/useOrganization';
import { ImportPreview, ZetkinPersonImportPostBody } from '../utils/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useConfigure(orgId: number) {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const configuredSheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const organization = useOrganization(orgId).data;
  const customFields = useCustomFields(orgId).data ?? [];
  if (!organization) {
    return;
  }
  const countryCode = organization.country as CountryCode;

  return async () => {
    const problems = predictProblems(
      configuredSheet,
      countryCode,
      customFields
    );

    const hasErrors = problems.some(
      (problem) => levelForProblem(problem) == 'error'
    );

    if (hasErrors) {
      dispatch(
        importPreviewAdd({
          problems: [],
          stats: {
            person: {
              summary: {
                addedToOrg: {
                  byOrg: {},
                  total: 0,
                },
                created: {
                  total: 0,
                },
                tagged: {
                  byTag: {},
                  total: 0,
                },
                updated: {
                  byChangedField: {},
                  byInitializedField: {},
                  total: 0,
                },
              },
            },
          },
        })
      );
    } else {
      const importOperations = prepareImportOperations(
        configuredSheet,
        countryCode
      );

      const previewRes = await apiClient.post<
        ImportPreview,
        ZetkinPersonImportPostBody
      >(`/api/orgs/${orgId}/bulk/preview`, {
        ops: importOperations,
      });

      dispatch(importPreviewAdd(previewRes));
    }
  };
}
