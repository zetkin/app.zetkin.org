import choices, { CHOICES } from '../choices';

export const filterChoicesByMode = (
  isRestrictedMode: boolean,
  category: { choices: CHOICES[] }
): CHOICES[] => {
  return category.choices.filter((key) => {
    if (!isRestrictedMode) {
      // All choices are allowed when not in restricted mode
      return true;
    }
    return choices[key].allowInRestrictedMode;
  });
};
