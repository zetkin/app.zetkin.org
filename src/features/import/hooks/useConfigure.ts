import { CountryCode } from 'libphonenumber-js';

import forseeErrors from '../utils/forseeErrors';
import prepareImportOperations from '../utils/prepareImportOperations';
import useOrganization from 'features/organizations/hooks/useOrganization';
import {
  importErrorsAdd,
  importErrorsClear,
  importOperationsAdd,
  importPreviewAdd,
  importPreviewClear,
} from '../store';
import { ImportPreview, ZetkinPersonImportPostBody } from '../utils/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useConfigure(orgId: number) {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const configuredSheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const organization = useOrganization(orgId).data;
  if (!organization) {
    return;
  }
  const countryCode = organization.country as CountryCode;

  return async () => {
    const errors = forseeErrors(configuredSheet, countryCode);

    if (errors.length > 0) {
      dispatch(importPreviewClear());
      dispatch(importErrorsAdd(errors));
    }

    if (!errors.length) {
      dispatch(importErrorsClear());

      const importOperations = prepareImportOperations(
        configuredSheet,
        countryCode
      );

      dispatch(importOperationsAdd(importOperations));

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
