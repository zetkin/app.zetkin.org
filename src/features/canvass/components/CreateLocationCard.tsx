import { FC, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  TextField,
} from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type CreateLocationCardProps = {
  onClose: () => void;
  onCreate: (title: string) => void;
  suggestions?: string[];
};

export const CreateLocationCard: FC<CreateLocationCardProps> = ({
  onClose,
  onCreate,
  suggestions = [],
}) => {
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState<string>('');

  const titles = suggestions ?? [];

  const { tokenOriginalByLower, tokenCounts, bigramCounts } = useMemo(() => {
    const tokenOriginalByLower = new Map<string, string>();
    const tokenCounts: Record<string, number> = {};
    const bigramCounts: Record<string, Record<string, number>> = {};

    titles.forEach((t) => {
      const toks = t.split(/\s+/).filter(Boolean);
      toks.forEach((tok, idx) => {
        const lower = tok.toLowerCase();
        if (!tokenOriginalByLower.has(lower)) {
          tokenOriginalByLower.set(lower, tok);
        }
        tokenCounts[lower] = (tokenCounts[lower] || 0) + 1;
        if (idx < toks.length - 1) {
          const next = toks[idx + 1].toLowerCase();
          if (!bigramCounts[lower]) {
            bigramCounts[lower] = {};
          }
          bigramCounts[lower][next] = (bigramCounts[lower][next] || 0) + 1;
        }
      });
    });

    return { bigramCounts, tokenCounts, tokenOriginalByLower };
  }, [titles]);

  const allTokenLowers = useMemo(
    () => Array.from(tokenOriginalByLower.keys()),
    [tokenOriginalByLower]
  );

  const generateSuggestions = (input: string): string[] => {
    if (!input) {
      return [];
    }

    if (!input.trim() || input.endsWith(' ')) {
      return [];
    }

    const parts = input.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return [];
    }

    const partsLower = parts.map((p) => p.toLowerCase());

    if (partsLower.length === 1 && /^\d+$/.test(partsLower[0])) {
      return [];
    }

    const lastIndex = partsLower.length - 1;
    const lastLower = partsLower[lastIndex];
    let candidates = allTokenLowers.filter(
      (tok) => tok !== lastLower && tok.startsWith(lastLower)
    );

    if (candidates.length === 0) {
      return [];
    }

    if (lastIndex > 0) {
      const prev = partsLower[lastIndex - 1];
      const nextCounts = bigramCounts[prev] || {};
      candidates = candidates.filter((c) => (nextCounts[c] || 0) > 0);
      candidates = candidates.sort((a, b) => {
        const aScore = (nextCounts[a] || 0) * 1000 + (tokenCounts[a] || 0);
        const bScore = (nextCounts[b] || 0) * 1000 + (tokenCounts[b] || 0);
        return bScore - aScore;
      });
    } else {
      candidates = candidates.sort(
        (a, b) => (tokenCounts[b] || 0) - (tokenCounts[a] || 0)
      );
    }

    const prefix = parts.slice(0, lastIndex).join(' ');
    const suggestionList = candidates.slice(0, 6).map((cand) => {
      const orig = tokenOriginalByLower.get(cand) || cand;
      return prefix ? `${prefix} ${orig}` : orig;
    });
    return suggestionList;
  };

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onCreate(title || messages.default.location());
        onClose();
      }}
    >
      <FormControl fullWidth>
        <Autocomplete
          filterOptions={(_, state) => generateSuggestions(state.inputValue)}
          freeSolo
          inputValue={title}
          onChange={(_, value) => {
            if (typeof value === 'string') {
              const withSpace = value.endsWith(' ') ? value : `${value} `;
              setTitle(withSpace);
            }
          }}
          onInputChange={(_, value) => setTitle(value)}
          options={titles}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              placeholder={messages.map.addLocation.inputPlaceholder()}
              sx={{ paddingTop: 1 }}
            />
          )}
          slotProps={{
            listbox: { sx: { maxHeight: 220, overflow: 'auto' } },
            popper: {
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: { altBoundary: true, rootBoundary: 'viewport' },
                },
              ],
              style: { zIndex: 14000 },
            },
          }}
        />
      </FormControl>
      <Box display="flex" gap={1} mt={1}>
        <Box flexBasis={1} flexGrow={1} flexShrink={1}>
          <Button fullWidth onClick={onClose} size="small" variant="outlined">
            <Msg id={messageIds.map.addLocation.cancel} />
          </Button>
        </Box>
        <Box flexBasis={1} flexGrow={1} flexShrink={1}>
          <Button
            disabled={!title}
            fullWidth
            onClick={() => {
              onCreate(title);
              onClose();
            }}
            size="small"
            type="submit"
            variant="contained"
          >
            <Msg id={messageIds.map.addLocation.create} />
          </Button>
        </Box>
      </Box>
    </form>
  );
};
