import { makeStyles } from '@mui/styles';
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
import { UglyContext } from 'utils/layout/DefaultLayout';

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

const useStyles = makeStyles({
  container: {
    bottom: 16,
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
  },
  paper: {
    height: '100%',
  },
});

export const PaneProvider: FC<PaneProviderProps> = ({
  children,
  fixedHeight,
}) => {
  const paneRef = useRef<PaneDef | null>(null);
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  const [key, setKey] = useState(0);

  const paneContainerRef = useRef<HTMLDivElement>();
  const slideRef = useRef<HTMLDivElement>();

  const { container } = useContext(UglyContext);

  const update = () => {
    const paneContainer = paneContainerRef.current;
    if (paneContainer) {
      const rect = paneContainer.getBoundingClientRect();
      if (slideRef.current) {
        if (rect.top <= 16 && !fixedHeight) {
          slideRef.current.style.position = 'fixed';
          slideRef.current.style.height = 'auto';
        } else {
          slideRef.current.style.position = 'absolute';
          if (!fixedHeight) {
            slideRef.current.style.height =
              Math.min(window.innerHeight - rect.top - 32, rect.height) + 'px';
          }
        }
      }
    }
  };

  useEffect(() => {
    if (container) {
      window.addEventListener('resize', update);
      container.addEventListener('scroll', update);

      return () => {
        window.removeEventListener('resize', update);
        container.removeEventListener('scroll', update);
      };
    }
  }, [container]);

  useEffect(() => {
    update();
  }, []);

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
        }}
      >
        <Slide
          key={key}
          ref={slideRef}
          className={styles.container}
          direction="left"
          in={!!paneRef.current && open}
          onEnter={() => {
            update();
          }}
          onEntered={() => {
            update();
          }}
        >
          <Box>
            <Paper
              className={styles.paper}
              elevation={2}
              sx={{
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
