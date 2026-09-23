import { useRouter } from 'next/router';
import { Box, Chip, Dialog, Tooltip } from '@mui/material';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import isUserTyping from 'features/search/utils/isUserTyping';
import matchResult from 'features/search/scopes/matchResult';
import messageIds from 'features/search/l10n/messageIds';
import ResultsList from 'features/search/components/SearchDialog/ResultsList';
import { scopeKey } from 'features/search/scopes/types';
import SearchField from './SearchField';
import { SEARCH_DATA_TYPE } from 'features/search/components/types';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
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

const SearchDialog: React.FunctionComponent<{
  activator: (openDialog: () => void) => JSX.Element;
}> = ({ activator }) => {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [removedScopes, setRemovedScopes] = useState<string[]>([]);
  const [armedScope, setArmedScope] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<SEARCH_DATA_TYPE[]>([]);

  const router = useRouter();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const scopes = useSearchScopes();
  const inputRef = useRef<HTMLInputElement>();

  const { error, results, isLoading, setQuery, queryString } = useSearch(orgId);

  const activeScopes = scopes.filter(
    (scope) => !removedScopes.includes(scopeKey(scope))
  );
  const members = useScopeMemberIds(activeScopes, open);

  // Every scope is back, and no type is singled out, each time search is opened
  const openDialog = () => {
    setRemovedScopes([]);
    setArmedScope(null);
    setSelectedTypes([]);
    setOpen(true);
  };

  const toggleType = (type: SEARCH_DATA_TYPE) =>
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item != type)
        : [...current, type]
    );

  const removeScope = (key: string) => {
    setRemovedScopes((current) => [...current, key]);
    setArmedScope(null);
  };

  /**
   * Backspace in an empty field works like it does on an email recipient:
   * the first press arms the last pill, the second removes it.
   */
  const handleFieldKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key != 'Backspace') {
      setArmedScope(null);
      return;
    }

    if (queryString.length > 0 || activeScopes.length == 0) {
      return;
    }

    ev.preventDefault();

    if (armedScope) {
      removeScope(armedScope);
      return;
    }

    const last = activeScopes[activeScopes.length - 1];
    setArmedScope(scopeKey(last));

    // Put the caret where the next press will take effect
    const input = inputRef.current;
    if (input) {
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }
  };

  // A result is shown when no active scope rules it out and at least one
  // vouches for it. Scopes that have nothing to say about a result type stay
  // silent instead of hiding it.
  const visibleResults = (results || [])
    .map((item) => item.result)
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
    const armed = armedScope == key;

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
        // Armed by backspace: show what the next press will remove
        sx={(theme) => ({
          boxShadow: armed ? `0 0 0 2px ${theme.palette.primary.dark}` : 'none',
        })}
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
            inputRef={inputRef}
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
