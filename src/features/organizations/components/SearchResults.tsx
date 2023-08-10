import { FilterListOutlined } from '@mui/icons-material';
import Fuse from 'fuse.js';
import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { TreeItemData } from '../types';
import { useMessages } from 'core/i18n';

interface SearchResultsProps {
  flatOrgData: TreeItemData[];
  searchString: string;
}

const SearchResults = ({ flatOrgData, searchString }: SearchResultsProps) => {
  const messages = useMessages(messageIds);

  const searchResults = useMemo(() => {
    const fuse = new Fuse(flatOrgData, {
      keys: ['title'],
      threshold: 0.4,
    });

    return searchString
      ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
      : flatOrgData;
  }, [searchString]);

  return (
    <>
      {searchResults.length > 0 &&
        searchResults.map((result) => (
          <Typography key={result.id}>{result.title}</Typography>
        ))}
      {!searchResults.length && (
        <Box alignItems="center" display="flex" flexDirection="column">
          <FilterListOutlined color="secondary" sx={{ fontSize: '12em' }} />
          <Typography color="secondary">
            {messages.sidebar.filter.noResults()}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SearchResults;
