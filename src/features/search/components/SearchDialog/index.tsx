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

  const {
    error: isError,
    results: searchResults,
    isLoading: isFetching,
    setQuery: setSearchQuery,
  } = useSearch(orgId);

  const handleRouteChange = () => {
    // Close dialog when clicking an item
    setOpen(false);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (!isUserTyping(e)) {
      if (e.key === '/') {
        e.preventDefault();
        setOpen(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

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
          setSearchQuery('');
        }}
        open={open}
      >
        <Box p={1}>
          <SearchField
            error={!!isError}
            loading={isFetching}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={() => {
              if (!isTyping) {
                setIsTyping(true);
              }
            }}
          />
          {searchResults && (
            <ResultsList results={searchResults.map((item) => item.result)} />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
