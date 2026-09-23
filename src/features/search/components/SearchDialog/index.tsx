import { useRouter } from 'next/router';
import { Box, Chip, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';

import filterResultsByScope from 'features/search/utils/filterResultsByScope';
import isUserTyping from 'features/search/utils/isUserTyping';
import messageIds from 'features/search/l10n/messageIds';
import ResultsList from 'features/search/components/SearchDialog/ResultsList';
import SearchField from './SearchField';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useSearch from 'features/search/hooks/useSearch';
import useSearchScope from 'features/search/hooks/useSearchScope';

const SearchDialog: React.FunctionComponent<{
  activator: (openDialog: () => void) => JSX.Element;
}> = ({ activator }) => {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [scopeEnabled, setScopeEnabled] = useState(true);

  const router = useRouter();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const scope = useSearchScope();

  const { error, results, isLoading, setQuery, queryString } = useSearch(orgId);

  // The scope is on by default every time search is opened
  const openDialog = () => {
    setScopeEnabled(true);
    setOpen(true);
  };

  const activeScope = scope && scopeEnabled ? scope : null;

  const handleRouteChange = () => {
    // Close dialog when clicking an item
    setOpen(false);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (!isUserTyping(e)) {
      if (e.key === '/') {
        e.preventDefault();
        openDialog();
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
      {activator(openDialog)}
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
          {scope && (
            <Box paddingTop={1} paddingX={1}>
              <Chip
                aria-pressed={scopeEnabled}
                clickable
                color={scopeEnabled ? 'primary' : 'default'}
                data-testid="SearchDialog-scopeChip"
                label={messages.scope.label({ title: scope.title })}
                onClick={() => setScopeEnabled(!scopeEnabled)}
                size="small"
                variant={scopeEnabled ? 'filled' : 'outlined'}
              />
            </Box>
          )}
          {Array.isArray(results) && queryString.length > 2 && !isLoading && (
            <ResultsList
              results={filterResultsByScope(
                results.map((item) => item.result),
                activeScope
              )}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
