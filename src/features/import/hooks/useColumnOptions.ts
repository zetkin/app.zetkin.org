import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from '../l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useMessages } from 'core/i18n';

interface Option {
  value: string;
  label: string;
}

export default function useColumnOptions(orgId: number): Option[] {
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const customFields = useCustomFields(orgId).data ?? [];

  const options: Option[] = [];

  options.push({
    label: messages.configuration.mapping.id(),
    value: 'id',
  });

  Object.values(NATIVE_PERSON_FIELDS).forEach((fieldSlug) => {
    if (fieldSlug != 'id' && fieldSlug != 'ext_id') {
      options.push({
        label: globalMessages.personFields[fieldSlug](),
        value: `field:${fieldSlug}`,
      });
    }
  });

  customFields.forEach((field) =>
    options.push({
      label: field.title,
      value: `field:${field.slug}`,
    })
  );

  options.push({
    label: messages.configuration.mapping.tags(),
    value: 'tag',
  });
  options.push({
    label: messages.configuration.mapping.organization(),
    value: 'org',
  });

  return options;
}
