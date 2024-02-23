import NextLink from 'next/link';
import React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { Box, Typography, useTheme } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

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
      label={
        <NextLink href={`/organize/${item.id}`} legacyBehavior>
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
        </NextLink>
      }
      nodeId={item.id.toString()}
      onClick={onSwitchOrg}
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
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpanded={
          // If there is only one top-level org, expand it by default
          treeItemData.length == 1 ? [treeItemData[0].id.toString()] : undefined
        }
        defaultExpandIcon={<ChevronRight />}
        disableSelection
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
      </TreeView>
    </div>
  );
}

export default OrganizationTree;
