import { useRouter } from 'next/router';
import { Box, Chip, Dialog, Tooltip } from '@mui/material';
import { KeyboardEvent, useEffect, useState } from 'react';

import isUserTyping from 'features/search/utils/isUserTyping';
import matchResult from 'features/search/scopes/matchResult';
import messageIds from 'features/search/l10n/messageIds';
import ResultsList from 'features/search/components/SearchDialog/ResultsList';
import { scopeKey } from 'features/search/scopes/types';
import SearchField from './SearchField';
import {
  SEARCH_DATA_TYPE,
  SearchResult,
} from 'features/search/components/types';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useScopeContents from 'features/search/hooks/useScopeContents';
import useScopeMemberIds from 'features/search/hooks/useScopeMemberIds';
import useSearch from 'features/search/hooks/useSearch';
import useSearchScopes from 'features/search/hooks/useSearchScopes';

// Ordered for the chip row: people and the lists they sit in belong together,
// then the activity types, then journeys
const TYPE_ORDER = [
  SEARCH_DATA_TYPE.PERSON,
  SEARCH_DATA_TYPE.VIEW,
  SEARCH_DATA_TYPE.PROJECT,
  SEARCH_DATA_TYPE.SURVEY,
  SEARCH_DATA_TYPE.TASK,
  SEARCH_DATA_TYPE.CALL_ASSIGNMENT,
  SEARCH_DATA_TYPE.JOURNEY_INSTANCE,
] as const;

function matchesQuery(result: SearchResult, query: string): boolean {
  const title =
    result.type === SEARCH_DATA_TYPE.PERSON
      ? `${result.match.first_name} ${result.match.last_name}`
      : result.match.title || '';

  return title.toLowerCase().includes(query);
}

const SearchDialog: React.FunctionComponent<{
  activator: (openDialog: () => void) => JSX.Element;
}> = ({ activator }) => {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [removedScopes, setRemovedScopes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SEARCH_DATA_TYPE[]>([]);

  const router = useRouter();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const scopes = useSearchScopes();

  const { error, results, isLoading, setQuery, queryString } = useSearch(orgId);

  const activeScopes = scopes.filter(
    (scope) => !removedScopes.includes(scopeKey(scope))
  );
  const members = useScopeMemberIds(activeScopes, open);
  const scopeContents = useScopeContents(activeScopes, open);

  // Every scope is back, and no type is singled out, each time search is opened
  const openDialog = () => {
    setRemovedScopes([]);
    setSelectedTypes([]);
    setOpen(true);
  };

  const toggleType = (type: SEARCH_DATA_TYPE) =>
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item != type)
        : [...current, type]
    );

  const removeScope = (key: string) =>
    setRemovedScopes((current) => [...current, key]);

  // Backspace in an empty field removes the last pill
  const handleFieldKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key != 'Backspace' || queryString.length > 0) {
      return;
    }

    if (activeScopes.length > 0) {
      ev.preventDefault();
      removeScope(scopeKey(activeScopes[activeScopes.length - 1]));
    }
  };

  // The search API caps its answer, so a scope's own contents are matched
  // here as well and merged in. Without this, a survey sitting in the project
  // you are standing in can be missing when its name is shared by many others.
  const query = queryString.toLowerCase();
  const fromScopes = scopeContents.filter((result) =>
    matchesQuery(result, query)
  );
  const seen = new Set<string>();

  const visibleResults = (results || [])
    .map((item) => item.result)
    .concat(fromScopes)
    .filter((result) => {
      const key = `${result.type}-${result.match.id}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    // No type selected means every type, so the chips start out of the way
    .filter(
      (result) =>
        selectedTypes.length == 0 || selectedTypes.includes(result.type)
    )
    .filter((result) => {
      if (activeScopes.length == 0) {
        return true;
      }

      const verdicts = activeScopes.map((scope) =>
        matchResult(result, scope, members)
      );

      return !verdicts.includes(false) && verdicts.includes(true);
    });

  const handleRouteChange = () => {
    // Close dialog when clicking an item
    setOpen(false);
  };

  const handleKeydown = (e: globalThis.KeyboardEvent) => {
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

  const scopePills = activeScopes.map((scope) => {
    const key = scopeKey(scope);

    return (
      <Chip
        key={key}
        color="primary"
        data-testid={`SearchDialog-scopeChip-${scope.type}`}
        label={messages.scope.label({
          title: scope.title,
          type: messages.scope.types[scope.type](),
        })}
        onDelete={() => removeScope(key)}
        size="small"
      />
    );
  });

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
            onKeyDown={(ev) => {
              handleFieldKeyDown(ev);
              if (!isTyping) {
                setIsTyping(true);
              }
            }}
            onUndo={
              removedScopes.length > 0 ? () => setRemovedScopes([]) : undefined
            }
            scopes={scopePills}
          />
          <Box
            alignItems="center"
            display="flex"
            flexWrap="wrap"
            gap={0.5}
            paddingTop={1}
            paddingX={1}
          >
            {TYPE_ORDER.map((type) => {
              const selected = selectedTypes.includes(type);

              return (
                <Chip
                  key={type}
                  aria-pressed={selected}
                  clickable
                  color={selected ? 'primary' : 'default'}
                  data-testid={`SearchDialog-typeChip-${type}`}
                  label={messages.types[type]()}
                  onClick={() => toggleType(type)}
                  size="small"
                  variant={selected ? 'filled' : 'outlined'}
                />
              );
            })}
            {/* Kept visible so the missing type is legible, not just absent */}
            <Tooltip title={messages.types.eventsUnavailable()}>
              <span>
                <Chip
                  data-testid="SearchDialog-typeChip-event"
                  disabled
                  label={messages.types.event()}
                  size="small"
                  variant="outlined"
                />
              </span>
            </Tooltip>
          </Box>
          {Array.isArray(results) && queryString.length > 2 && !isLoading && (
            <ResultsList results={visibleResults} />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default SearchDialog;
