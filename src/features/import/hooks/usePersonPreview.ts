import createPreviewData from '../utils/createPreviewData';
import { Sheet } from '../utils/types';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag, ZetkinOrganization } from 'utils/types/zetkin';

export default function usePersonPreview(
  sheet: Sheet,
  personIndex: number,
  orgId: number
) {
  const allTags = useTags(orgId).data ?? [];
  const organizations = useSubOrganizations(orgId).data ?? [];
  const previewRow = createPreviewData(sheet, personIndex);
  const fields = previewRow?.data;
  const tags =
    previewRow?.tags?.reduce((acc: ZetkinTag[], mappedTag) => {
      const tag = allTags.find((t) => t.id === mappedTag.id);
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    }, []) ?? [];

  const orgs =
    previewRow?.organizations?.reduce(
      (acc: ZetkinOrganization[], mappedOrgId) => {
        const org = organizations.find((o) => {
          return o.id === mappedOrgId;
        });
        if (org) {
          return acc.concat(org);
        }
        return acc;
      },
      []
    ) ?? [];

  return {
    fields,
    orgs,
    tags,
  };
}
