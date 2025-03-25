import { useNumericRouteParams } from 'core/hooks';

export default function usePreviewEmail() {
  const { emailId, orgId } = useNumericRouteParams();

  return {
    previewUrl: `/o/${orgId}/viewmail/${emailId}`,
  };
}
