import { makeStyles } from '@mui/styles';
import { Box, Paper, Slide } from '@mui/material';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';

import Pane from './Pane';

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
};

const useStyles = makeStyles({
  container: {
    bottom: 16,
    position: 'absolute',
    right: 16,
    top: '30vh',
    zIndex: 10,
  },
  paper: {
    height: 'calc(100vh - 32vh)',
  },
});

export const PaneProvider: FC<PaneProviderProps> = ({ children }) => {
  const paneRef = useRef<PaneDef | null>(null);
  const [open, setOpen] = useState(false);
  const styles = useStyles();
  const [key, setKey] = useState(0);

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
      <Slide
        key={key}
        className={styles.container}
        direction="left"
        in={!!paneRef.current && open}
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
    </PaneContext.Provider>
  );
};

export function usePanes() {
  const { currentPane, openPane } = useContext(PaneContext);

  return { isOpen: !!currentPane && open, openPane };
}
