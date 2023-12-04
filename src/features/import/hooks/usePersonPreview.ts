import { prepareImportOperationsForRow } from '../utils/prepareImportOperations';
import { Sheet } from '../utils/types';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

export default function usePersonPreview(
  sheet: Sheet,
  personIndex: number,
  orgId: number
) {
  const allTags = useTags(orgId).data ?? [];
  const organizations = useOrganizations().data ?? [];

  const previewRow = prepareImportOperationsForRow(sheet, personIndex);

  const fields = previewRow?.fields;
  const tags =
    previewRow?.tags?.reduce((acc: ZetkinTag[], tagId) => {
      const tag = allTags.find((tag) => tag.id === tagId);
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    }, []) ?? [];

  const org = organizations.find(
    (org) => org.id === (previewRow?.organizations?.[0] || [])
  );

  return {
    fields,
    org,
    tags,
  };
}
