import messageIds from 'features/manage/l10n/messageIds';
import { ZetkinUser } from 'utils/types/zetkin';

export const detailsCheckboxesKeys: (keyof ZetkinUser &
  keyof typeof messageIds.users.details.checkboxes)[] = [
  'email_is_verified',
  'phone_is_verified',
];

export const detailsFieldKeys: (keyof ZetkinUser &
  keyof typeof messageIds.users.details.fields)[] = [
  'first_name',
  'last_name',
  'email',
  'phone',
  'lang',
];
