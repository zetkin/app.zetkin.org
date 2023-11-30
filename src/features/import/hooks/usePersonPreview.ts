import prepareImportOperations from '../utils/prepareImportOperations';
import { Sheet } from '../utils/types';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

export default function usePersonPreview(
  sheet: Sheet,
  personIndex: number,
  orgId: number
) {
  const allTags = useTags(orgId).data ?? [];
  const configuredSheet = prepareImportOperations(sheet)[personIndex];
  const fields = configuredSheet?.fields;
  const tags =
    configuredSheet?.tags?.reduce((acc: ZetkinTag[], tagId) => {
      const tag = allTags.find((tag) => tag.id === tagId);
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    }, []) ?? [];
  return {
    fields,
    tags,
  };
}
