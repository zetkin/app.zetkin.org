import { FormattedMessage } from 'react-intl';
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

  const classes = useStyles();
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const handleRouteChange = () => {
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
    refetch,
    data: searchResults,
    isFetching,
    isError,
  } = useQuery(
    ['searchResults', searchQuery],
    getSearchResults(orgId, searchQuery),
    { enabled: false }
  );

  const debouncedSearch = useDebounce(async () => {
    refetch();
  }, 600);

  // Watch for changes on the search field value and debounce search if changed
  useEffect(() => {
    if (searchQuery.length >= MINIMUM_CHARACTERS) {
      debouncedSearch();
    }
  }, [searchQuery, debouncedSearch]);

  return (
    <>
      {/* Activator */}
      <Button
        data-testId="SearchDialog-activator"
        onClick={() => setOpen(true)}
        startIcon={<Search />}
      >
        <FormattedMessage id={`layout.organize.search.label`} />
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
          />
          {searchResults && <ResultsList results={searchResults} />}
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
