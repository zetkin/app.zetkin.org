import messageIds from '../l10n/messageIds';

/**
 * Picks a message explaining why the API rejected a field, or returns null
 * for statuses we have nothing more useful to say about, in which case the
 * caller should fall back to its own generic message.
 */
export default function getFieldErrorMessageId(status: number | null) {
  if (status === 409) {
    return messageIds.fields.errors.slugInUse;
  }

  if (status === 400) {
    return messageIds.fields.errors.invalidData;
  }

  return null;
}
