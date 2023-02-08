import { CATEGORIES } from '../categories';
import choices, { CHOICES } from '../choices';

export const filteringKeys = (
  isRestrictedMode: boolean,
  category: { choices: CHOICES[]; key: CATEGORIES }
): CHOICES[] => {
  const filteredKeys = category.choices.filter((key) => {
    if (!isRestrictedMode) {
      // All choices are allowed when not in restricted mode
      return true;
    }
    return choices[key].allowInRestrictedMode;
  });
  return filteredKeys;
};
