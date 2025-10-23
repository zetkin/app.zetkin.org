import React from 'react';
import { Box, Link, Typography, useTheme } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';

import ProceduralColorIcon from './ProceduralColorIcon';
import { TreeItemData } from '../types';

interface OrganizationTreeProps {
  treeItemData: TreeItemData[];
  onSwitchOrg: () => void;
  orgId: number;
}

function renderTree(props: OrganizationTreeProps): React.ReactNode {
  const { treeItemData, orgId, onSwitchOrg } = props;
  const sortedTreeItems = [...treeItemData].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return sortedTreeItems.map((item) => (
    <TreeItem
      key={item.id}
      itemId={item.id.toString()}
      label={
        <Link color="inherit" href={`/organize/${item.id}`} underline="none">
          <Box
            m={1}
            onClick={(e) => e.stopPropagation()}
            sx={{ alignItems: 'center', display: 'inlineFlex' }}
          >
            <Box mr={1}>
              <ProceduralColorIcon id={item.id} />
            </Box>
            <Typography
              sx={{ fontWeight: orgId == item.id ? 'bold' : 'normal' }}
              variant="body2"
            >
              {item.title}
            </Typography>
          </Box>
        </Link>
      }
      onClick={onSwitchOrg}
      sx={(theme) => ({
        '.MuiTreeItem-content.Mui-focused:hover': {
          backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : undefined,
        },
      })}
    >
      {item.children
        ? renderTree({ onSwitchOrg, orgId, treeItemData: item.children })
        : ''}
    </TreeItem>
  ));
}

function OrganizationTree({
  treeItemData,
  onSwitchOrg,
  orgId,
}: OrganizationTreeProps): JSX.Element {
  const theme = useTheme();

  return (
    <div>
      <SimpleTreeView
        defaultExpandedItems={
          // If there is only one top-level org, expand it by default
          treeItemData.length == 1 ? [treeItemData[0].id.toString()] : undefined
        }
        disableSelection
        slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
        sx={{
          '& .Mui-focused': {
            backgroundColor: theme.palette.grey[100],
          },
          '&:hover .Mui-focused': {
            backgroundColor: 'transparent',
          },
          '&:hover .Mui-focused:hover': {
            backgroundColor: theme.palette.grey[100],
          },
        }}
      >
        {renderTree({ onSwitchOrg, orgId, treeItemData })}
      </SimpleTreeView>
    </div>
  );
}

export default OrganizationTree;
