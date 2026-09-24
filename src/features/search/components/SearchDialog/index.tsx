import { useRouter } from 'next/router';
import { Box, Chip, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';

import isUserTyping from 'features/search/utils/isUserTyping';
import messageIds from 'features/search/l10n/messageIds';
import ResultsList, { GROUP_ORDER } from './ResultsList';
import SearchField from './SearchField';
import { SEARCH_DATA_TYPE } from 'features/search/components/types';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useSearch from 'features/search/hooks/useSearch';

const SearchDialog: React.FunctionComponent<{
  activator: (openDialog: () => void) => JSX.Element;
}> = ({ activator }) => {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedType, setSelectedType] = useState<SEARCH_DATA_TYPE | null>(
    null
  );

  const router = useRouter();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const { error, results, isLoading, setQuery, queryString } = useSearch(orgId);

  const openDialog = () => {
    setSelectedType(null);
    setOpen(true);
  };

  const toggleType = (type: SEARCH_DATA_TYPE) =>
    setSelectedType((current) => (current === type ? null : type));

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

  const allResults = (results || []).map((item) => item.result);
  const hasSearched = Array.isArray(results) && queryString.length > 2;

  const countByType = allResults.reduce<
    Partial<Record<SEARCH_DATA_TYPE, number>>
  >((counts, result) => {
    counts[result.type] = (counts[result.type] ?? 0) + 1;
    return counts;
  }, {});

  const chipTypes = hasSearched
    ? [...GROUP_ORDER].sort(
        (a, b) => (countByType[b] ? 1 : 0) - (countByType[a] ? 1 : 0)
      )
    : GROUP_ORDER;

  const visibleResults = allResults.filter(
    (result) => !selectedType || result.type === selectedType
  );

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
          <Box display="flex" flexWrap="wrap" gap={0.5} paddingTop={1}>
            {chipTypes.map((type) => {
              const selected = selectedType === type;

              return (
                <Chip
                  key={type}
                  aria-pressed={selected}
                  clickable
                  color={selected ? 'primary' : 'default'}
                  data-testid={`SearchDialog-typeChip-${type}`}
                  disabled={hasSearched && !countByType[type] && !selected}
                  label={messages.groups[type]()}
                  onClick={() => toggleType(type)}
                  size="small"
                  variant={selected ? 'filled' : 'outlined'}
                />
              );
            })}
          </Box>
          {Array.isArray(results) && queryString.length > 2 && !isLoading && (
            <ResultsList
              onSelectType={setSelectedType}
              results={visibleResults}
              selectedType={selectedType}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
