import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { Box, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';

import isUserTyping from 'features/search/utils/isUserTyping';
import ResultsList from 'features/search/components/SearchDialog/ResultsList';
import SearchField from './SearchField';
import { useNumericRouteParams } from 'core/hooks';
import useSearch from 'features/search/hooks/useSearch';

const useStyles = makeStyles(() => ({
  topPaperScrollBody: {
    verticalAlign: 'top',
  },
  topScrollPaper: {
    alignItems: 'flex-start',
  },
}));

const SearchDialog: React.FunctionComponent<{
  activator: (openDialog: () => void) => JSX.Element;
}> = ({ activator }) => {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const classes = useStyles();
  const router = useRouter();
  const { orgId } = useNumericRouteParams();

  const { error, results, isLoading, setQuery, queryString } = useSearch(orgId);

  const handleRouteChange = () => {
    // Close dialog when clicking an item
    setOpen(false);
  };

  // We want this `keydown` event handler to run in the capturing-phase, and
  // that it is only attached on mount. This is to make sure that this handler
  // runs before the `keydown` event handler in `EmailEditorFrontend`, which
  // stops propagation in order to prevent editor.js from hijacking focus.
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isUserTyping(e)) {
        if (e.key === '/') {
          e.preventDefault();
          setOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeydown, true);
    return () => {
      document.removeEventListener('keydown', handleKeydown, true);
    };
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      {activator(() => setOpen(true))}
      <Dialog
        classes={{
          paperScrollBody: classes.topPaperScrollBody,
          scrollPaper: classes.topScrollPaper,
        }}
        fullWidth
        onClose={() => {
          setOpen(false);
          setQuery('');
        }}
        open={open}
      >
        <Box p={1}>
          <SearchField
            error={!!error}
            loading={isLoading}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={() => {
              if (!isTyping) {
                setIsTyping(true);
              }
            }}
          />
          {Array.isArray(results) && queryString.length > 2 && !isLoading && (
            <ResultsList results={results.map((item) => item.result)} />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
