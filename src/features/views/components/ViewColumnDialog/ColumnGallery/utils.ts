import choices, { CHOICES } from '../choices';

export const filterChoicesByMode = (
  isRestrictedMode: boolean,
  categoryChoices: CHOICES[]
): CHOICES[] => {
  return categoryChoices.filter((key) => {
    if (!isRestrictedMode) {
      // All choices are allowed when not in restricted mode
      return true;
    }
    return choices[key].allowInRestrictedMode;
  });
};
