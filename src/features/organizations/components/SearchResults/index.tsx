import NextLink from 'next/link';
import { Box, Typography, useTheme } from '@mui/material';

import Ancestors from './Ancestors';
import ProceduralColorIcon from '../ProceduralColorIcon';
import { TreeItemData } from '../../types';

interface SearchResultsProps {
  flatOrgData: TreeItemData[];
  matchingOrgs: TreeItemData[];
  onSwitchOrg: () => void;
}

const SearchResults = ({
  flatOrgData,
  matchingOrgs,
  onSwitchOrg,
}: SearchResultsProps) => {
  const theme = useTheme();

  function findAncestors(node: TreeItemData | null): TreeItemData[] {
    if (node === null) {
      return [];
    }

    const ancestors: TreeItemData[] = [];

    const getParent = (childOrg: TreeItemData) => {
      return flatOrgData.find((org) => {
        return org.id == childOrg.parent?.id;
      });
    };

    let parent = getParent(node);
    while (parent != null) {
      ancestors.push(parent);
      parent = getParent(parent);
    }

    return ancestors.reverse();
  }

  const searchResultsByParent: Record<number, TreeItemData[]> = {};

  matchingOrgs.forEach((result) => {
    //Give 0 as parent id to top level orgs
    const parentId = result.parent?.id ?? 0;

    if (!searchResultsByParent[parentId]) {
      searchResultsByParent[parentId] = [];
    }
    searchResultsByParent[parentId].push(result);
  });

  const keys = Object.keys(searchResultsByParent);

  return (
    <>
      {keys.map((key) => {
        const results = searchResultsByParent[parseInt(key)];
        return (
          <Box key={key}>
            <Box paddingX={1}>
              <Ancestors ancestors={findAncestors(results[0])} />
            </Box>
            {results.map((result) => (
              <NextLink key={result.id} href={`/organize/${result.id}`}>
                <Box
                  display="flex"
                  flexDirection="column"
                  onClick={onSwitchOrg}
                >
                  <Box
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.grey[100],
                      },
                      alignItems: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      paddingLeft: 3,
                      paddingRight: 1,
                      paddingY: 1,
                      width: '100%',
                    }}
                  >
                    <Box marginRight={1}>
                      <ProceduralColorIcon id={result.id} />
                    </Box>
                    <Typography variant="body2">{result.title}</Typography>
                  </Box>
                </Box>
              </NextLink>
            ))}
          </Box>
        );
      })}
    </>
  );
};

export default SearchResults;
