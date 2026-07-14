import { useRouter } from 'next/router';
import { Box, Paper, Slide } from '@mui/material';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import Pane from './Pane';
import useResizablePane from 'utils/panes/useResizablePane';

type PaneDef = {
  render: () => ReactNode;
  width: number;
};

type PaneContextData = {
  currentPane: PaneDef | null;
  openPane: (pane: PaneDef) => void;
};

const PaneContext = createContext<PaneContextData>({
  currentPane: null,
  openPane: () => {
    // Default function does nothing, but is overridden
    // in the Provider component where it sets state.
    return undefined;
  },
});

type PaneProviderProps = {
  children: ReactNode;
  fixedHeight: boolean;
};

export const PaneProvider: FC<PaneProviderProps> = ({
  children,
  fixedHeight,
}) => {
  const paneRef = useRef<PaneDef | null>(null);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);
  const { pathname } = useRouter();

  const { paneContainerRef, slideRef, updatePaneHeight } =
    useResizablePane(fixedHeight);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <PaneContext.Provider
      value={{
        currentPane: paneRef.current,
        openPane: (pane) => {
          paneRef.current = pane;
          setOpen(true);
          setKey((old) => old + 1);
        },
      }}
    >
      <Box
        ref={paneContainerRef}
        style={{
          height: fixedHeight ? '100%' : 'auto',
          minHeight: '100%',
        }}
      >
        <Slide
          key={key}
          ref={slideRef}
          direction="left"
          in={!!paneRef.current && open}
          onEnter={() => {
            updatePaneHeight();
          }}
          onEntered={() => {
            updatePaneHeight();
          }}
        >
          <Box
            sx={{
              bottom: '16px',
              position: 'absolute',
              right: '16px',
              top: '16px',
              zIndex: 999,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                height: '100%',
                width: paneRef.current?.width ?? 200,
              }}
            >
              {paneRef.current && (
                <Pane
                  onClose={() => {
                    setOpen(false);
                  }}
                >
                  {paneRef.current.render()}
                </Pane>
              )}
            </Paper>
          </Box>
        </Slide>
        {children}
      </Box>
    </PaneContext.Provider>
  );
};

export function usePanes() {
  const { currentPane, openPane } = useContext(PaneContext);

  return { isOpen: !!currentPane && open, openPane };
}
