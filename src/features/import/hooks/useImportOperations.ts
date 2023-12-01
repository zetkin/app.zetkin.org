import { CountryCode } from 'libphonenumber-js';

import forseeErrors from '../utils/forseeErrors';
import { PersonImport } from '../utils/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import { importErrorsAdd, importErrorsClear, importPreviewAdd } from '../store';
import prepareImportOperations, {
  ZetkinPersonImportOp,
} from '../utils/prepareImportOperations';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface ZetkinPesonImportPostBody {
  ops: ZetkinPersonImportOp[];
}

interface ImportRes {
  stats: {
    person: PersonImport;
  };
}

export default function useImportOperations(orgId: number) {
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
      dispatch(importErrorsAdd(errors));
    }

    if (!errors.length) {
      dispatch(importErrorsClear());

      const importOperations = prepareImportOperations(
        configuredSheet,
        countryCode
      );

      const previewRes = await apiClient.post<
        ImportRes,
        ZetkinPesonImportPostBody
      >(`/api/orgs/${orgId}/bulk/preview`, {
        ops: importOperations,
      });
      dispatch(importPreviewAdd(previewRes.stats.person));
    }
  };
}
