import { createContext } from 'react';

const PageContainerContext = createContext<{
  container: HTMLDivElement | null;
}>({ container: null });

export { PageContainerContext };
