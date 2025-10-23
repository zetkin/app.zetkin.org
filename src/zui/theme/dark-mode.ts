export const setDarkModeToLocalStorage = (newDarkMode: boolean | 'auto') => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (newDarkMode !== 'auto') {
    localStorage.setItem('darkMode', newDarkMode + '');
    return;
  }

  if (localStorage.getItem('darkMode') !== null) {
    localStorage.removeItem('darkMode');
  }
};

export const getDarkModeFromLocalStorage = (): boolean => {
  const setting = getDarkModeSettingFromLocalStorage();
  if (setting !== 'auto') {
    return setting;
  }

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};

export const getDarkModeSettingFromLocalStorage = (): boolean | 'auto' => {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  const storedDarkMode = localStorage.getItem('darkMode');
  if (storedDarkMode !== null) {
    return storedDarkMode === 'true';
  }

  return 'auto';
};
