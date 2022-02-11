import { FormattedMessage } from 'react-intl';
import { Search } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { Box, Button, Dialog } from '@material-ui/core';
import { useEffect, useState } from 'react';

import { defaultFetch } from 'fetching';
import handleResponseData from 'api/utils/handleResponseData';
import ResultsList from './ResultsList';
import SearchField from './SearchField';
import { SearchResult } from 'types/search';
import useDebounce from 'hooks/useDebounce';
import { useQuery } from 'react-query';

export const MINIMUM_CHARACTERS = 3;

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

  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const {
    refetch,
    data: searchResults,
    isIdle,
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
      <Button onClick={() => setOpen(true)} startIcon={<Search />}>
        <FormattedMessage id={`layout.organize.search.label`} />
      </Button>
      <Dialog
        fullWidth
        onClose={() => {
          setOpen(false);
          setSearchQuery('');
        }}
        open={open}
      >
        <Box p={4}>
          <SearchField onChange={(e) => setSearchQuery(e.target.value)} />
          <ResultsList
            error={isError}
            loading={isIdle || isFetching}
            results={searchResults || []}
            searchQuery={searchQuery}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
