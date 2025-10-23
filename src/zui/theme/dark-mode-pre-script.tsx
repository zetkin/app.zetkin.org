export const DarkModePreScript = () => {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (typeof localStorage === "undefined" || typeof window === "undefined")
              return;
            
            const storedDarkMode = localStorage.getItem('darkMode');
            if (
              storedDarkMode === "false" || (
                storedDarkMode === null && (
                  !window.matchMedia ||
                  !window.matchMedia('(prefers-color-scheme: dark)').matches
                )
              )
            ) {
              return;
            }
            
            document.getElementsByTagName("html")[0].style.backgroundColor = "#151515";
          })();
        `,
      }}
    />
  );
};
