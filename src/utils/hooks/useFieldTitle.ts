import globalMessageIds from 'core/i18n/globalMessageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useMessages } from 'core/i18n';

export default function useFieldTitle(orgId: number) {
  const customFields = useCustomFields(orgId).data ?? [];
  const globalMessages = useMessages(globalMessageIds);

  const nativeFields = Object.values(NATIVE_PERSON_FIELDS) as string[];

  return (fieldSlug: string) =>
    nativeFields.includes(fieldSlug)
      ? globalMessages.personFields[fieldSlug as NATIVE_PERSON_FIELDS]()
      : customFields.find((customField) => customField.slug === fieldSlug)
          ?.title ?? '';
}
