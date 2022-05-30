import { makeStyles } from '@material-ui/styles';
import { Search } from '@material-ui/icons';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, Dialog } from '@material-ui/core';
import { useEffect, useState } from 'react';

import { defaultFetch } from 'fetching';
import handleResponseData from 'api/utils/handleResponseData';
import isUserTyping from 'utils/isUserTyping';
import ResultsList from './ResultsList';
import SearchField from './SearchField';
import { SearchResult } from 'types/search';
import useDebounce from 'hooks/useDebounce';

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

const SearchDialog: React.FunctionComponent = () => {
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
      {/* Activator */}
      <Button
        data-testid="SearchDialog-activator"
        onClick={() => setOpen(true)}
      >
        <Search />
      </Button>
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
        <Box p={4}>
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
