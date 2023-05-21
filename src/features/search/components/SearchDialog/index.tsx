import { makeStyles } from '@mui/styles';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';

import defaultFetch from 'utils/fetching/defaultFetch';
import handleResponseData from 'utils/api/handleResponseData';
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

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const SearchDialog: React.FunctionComponent<SearchDialogProps> = ({
  open,
  onClose,
}) => {
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
    onClose();
  };

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
      <Dialog
        classes={{
          paperScrollBody: classes.topPaperScrollBody,
          scrollPaper: classes.topScrollPaper,
        }}
        fullWidth
        onClose={() => {
          onClose();
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
