import { CountryCode } from 'libphonenumber-js';

import foreseeErrors from '../utils/foreseeErrors';
import prepareImportOperations from '../utils/prepareImportOperations';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useOrganization from 'features/organizations/hooks/useOrganization';
import {
  IMPORT_ERROR,
  ImportPreview,
  ZetkinPersonImportPostBody,
} from '../utils/types';
import { importErrorsAdd, importPreviewAdd } from '../store';
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
    const errors = foreseeErrors(configuredSheet, countryCode, customFields);

    if (errors.length > 0 && !errors.includes(IMPORT_ERROR.ID_MISSING)) {
      dispatch(
        importPreviewAdd({
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
            byField: {},
            total: 0,
          },
        })
      );
      dispatch(importErrorsAdd(errors));
    }

    if (
      !errors.length ||
      (errors.length == 1 && errors.includes(IMPORT_ERROR.ID_MISSING))
    ) {
      dispatch(importErrorsAdd(errors));

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

      dispatch(importPreviewAdd(previewRes.stats.person.summary));
    }
  };
}
