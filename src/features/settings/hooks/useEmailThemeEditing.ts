import { EmailTheme } from 'features/emails/types';
import { useAppSelector } from 'core/hooks';

export default function useEmailThemeEditing(theme: EmailTheme | null) {
  const localValues = useAppSelector((state) => state.emails.themeEditorValue);

  const hasUnsavedChanges = () => {
    return theme
      ? localValues.frame_mjml !== JSON.stringify(theme.frame_mjml, null, 2) ||
          localValues.css !== (theme.css || '') ||
          localValues.block_attributes !==
            JSON.stringify(theme.block_attributes, null, 2)
      : false;
  };

  return { hasUnsavedChanges, localValues };
}
