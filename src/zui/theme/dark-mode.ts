export const setDarkModeToLocalStorage = (newDarkMode: boolean | 'auto') => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (newDarkMode !== 'auto') {
    localStorage.setItem('darkMode', newDarkMode + '');
  }

  if (localStorage.getItem('darkMode') !== null) {
    localStorage.removeItem('darkMode');
  }
};

export const getDarkModeFromLocalStorage = (): boolean => {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  const storedDarkMode = localStorage.getItem('darkMode');
  if (storedDarkMode !== null) {
    return storedDarkMode === 'true';
  }

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};
