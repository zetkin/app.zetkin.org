import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';

import defaultFetch from 'utils/fetching/defaultFetch';
import handleResponseData from 'utils/api/handleResponseData';
import isUserTyping from 'features/search/utils/isUserTyping';
import ResultsList from 'features/search/components/SearchDialog/ResultsList';
import SearchField from './SearchField';
import { SearchResult } from '../types';
import useDebounce from 'utils/hooks/useDebounce';

export const MINIMUM_CHARACTERS = 2;

const useStyles = makeStyles(() => ({
  topPaperScrollBody: {
    verticalAlign: 'top',
  },
  topScrollPaper: {
    alignItems: 'flex-start',
  },
}));

const getSearchResults = (orgId: string, searchQuery: string) => {
  return async () => {
    const res = await defaultFetch(`/search?orgId=${orgId}`, {
      body: JSON.stringify({ q: searchQuery }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    return handleResponseData<SearchResult[]>(res, 'post');
  };
};

const SearchDialog: React.FunctionComponent<{
  activator: (open: () => void) => JSX.Element;
}> = ({ activator }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const classes = useStyles();
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const debouncedFinishedTyping = useDebounce(async () => {
    setIsTyping(false);
  }, 600);

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

  const {
    data: searchResults,
    isFetching,
    isError,
  } = useQuery(
    ['searchResults', searchQuery],
    getSearchResults(orgId, searchQuery),
    {
      enabled: !isTyping && searchQuery.length >= MINIMUM_CHARACTERS,
      retry: false,
    }
  );

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
            error={isError}
            loading={isFetching}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={() => {
              if (!isTyping) {
                setIsTyping(true);
              }
              debouncedFinishedTyping();
            }}
          />
          {searchResults && <ResultsList results={searchResults} />}
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
