import prepareImportOperations from '../utils/prepareImportOperations';
import { Sheet } from '../utils/types';

export default function usePersonPreview(sheet: Sheet, personIndex: number) {
  // const tags = useTags(orgId).data ?? [];
  const fields = prepareImportOperations(sheet)[personIndex]?.fields;

  return {
    fields,
  };
}
