import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useMessages } from 'core/i18n';
import { Field, FieldTypes } from '../utils/types';

export default function useFields(orgId: number): Field[] {
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const customFields = useCustomFields(orgId).data ?? [];

  const fieldsWithoutId: { slug: string; title: string }[] = [];

  customFields.forEach((field) =>
    fieldsWithoutId.push({
      slug: field.slug,
      title: field.title,
    })
  );

  Object.values(NATIVE_PERSON_FIELDS).forEach((fieldSlug) =>
    fieldsWithoutId.push({
      slug: fieldSlug,
      title: globalMessages.personFields[fieldSlug](),
    })
  );

  const fields = fieldsWithoutId
    .filter((field) => field.slug != 'id' && field.slug != 'ext_id')
    .map((field) => ({
      ...field,
      type: FieldTypes.BASIC,
    }));

  fields.push({
    slug: 'org',
    title: messages.configuration.mapping.organization(),
    type: FieldTypes.ORGANIZATION,
  });
  fields.push({
    slug: 'tags',
    title: messages.configuration.mapping.tags(),
    type: FieldTypes.TAG,
  });
  fields.push({
    slug: 'id',
    title: messages.configuration.mapping.id().toLocaleUpperCase(),
    type: FieldTypes.ID,
  });

  return fields
    .map((field, index) => ({
      ...field,
      id: index + 1,
    }))
    .sort((field1, field2) => field1.title.localeCompare(field2.title));
}
