import Fuse from 'fuse.js';
import { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ChevronRight, FilterListOutlined } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import ProceduralColorIcon from './ProceduralColorIcon';
import { TreeItemData } from '../types';
import { useMessages } from 'core/i18n';

interface SearchResultsProps {
  flatOrgData: TreeItemData[];
  searchString: string;
}

const SearchResults = ({ flatOrgData, searchString }: SearchResultsProps) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  const searchResults = useMemo(() => {
    const fuse = new Fuse(flatOrgData, {
      keys: ['title'],
      threshold: 0.4,
    });

    return searchString
      ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
      : flatOrgData;
  }, [searchString]);

  function findAncestors(node: TreeItemData): TreeItemData[] {
    const ancestors: TreeItemData[] = [];

    const getParent = (childOrg: TreeItemData) => {
      return flatOrgData.find((org) => org.id == childOrg.parent?.id);
    };

    let parent = getParent(node);
    while (parent != null) {
      ancestors.push(parent);
      parent = getParent(parent);
    }

    return ancestors;
  }

  return (
    <>
      {searchResults.length > 0 &&
        searchResults.map((result, index) => (
          <Box
            key={result.id}
            display="flex"
            flexDirection="column"
            paddingTop={index == 0 ? '' : 1}
            paddingX={1}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
              },
              cursor: 'pointer',
            }}
          >
            <Box display="flex">
              {findAncestors(result).map((ancestor, index) => (
                <Box key={ancestor.id} display="flex">
                  {index == 0 && (
                    <Typography color="secondary" variant="body2">
                      ...
                    </Typography>
                  )}
                  <ChevronRight color="secondary" fontSize="small" />
                  <Typography color="secondary" variant="body2">
                    {ancestor.title}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'inlineFlex',
                paddingLeft: 2,
                paddingRight: 1,
                paddingY: 1,
              }}
            >
              <Box marginRight={1}>
                <ProceduralColorIcon id={result.id} />
              </Box>
              <Typography variant="body2">{result.title}</Typography>
            </Box>
          </Box>
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
