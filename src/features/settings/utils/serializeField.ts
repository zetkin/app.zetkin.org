import { EmailThemePatchBody } from 'features/emails/types';

export const serializeField = (
  value: string,
  editingSection: keyof EmailThemePatchBody
) => {
  if (editingSection === 'css') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
