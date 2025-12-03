import { useRouter } from 'next/router';
import { Box, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';

import isUserTyping from 'features/search/utils/isUserTyping';
import ResultsList from 'features/search/components/SearchDialog/ResultsList';
import SearchField from './SearchField';
import { useNumericRouteParams } from 'core/hooks';
import useSearch from 'features/search/hooks/useSearch';

const SearchDialog: React.FunctionComponent<{
  activator: (openDialog: () => void) => JSX.Element;
}> = ({ activator }) => {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const router = useRouter();
  const { orgId } = useNumericRouteParams();

  const { error, results, isLoading, setQuery, queryString } = useSearch(orgId);

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
        fullWidth
        onClose={() => {
          setOpen(false);
          setQuery('');
        }}
        open={open}
        sx={{
          '& .MuiDialog-paperScrollBody': {
            verticalAlign: 'top',
          },
          '& .MuiDialog-scrollPaper': {
            alignItems: 'flex-start',
          },
        }}
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
