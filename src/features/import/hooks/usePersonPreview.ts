import prepareImportOperations from '../utils/prepareImportOperations';
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

  const orgs =
    configuredSheet?.organizations?.reduce((acc: string[], orgId) => {
      const org = organizations.find((org) => org.id === orgId);
      if (org) {
        return acc.concat(org.title);
      }
      return acc;
    }, []) ?? [];

  return {
    fields,
    orgs,
    tags,
  };
}
