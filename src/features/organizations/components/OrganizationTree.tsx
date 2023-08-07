import NextLink from 'next/link';
import ProceduralColorIcon from './ProceduralColorIcon';
import React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { TreeItemData } from '../types';
import TreeView from '@mui/lab/TreeView';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

interface OrganizationTreeProps {
  treeItemData: TreeItemData[];
  onSwitchOrg: () => void;
  orgId: number;
}

function renderTree(
  nodes: TreeItemData[],
  onSwitchOrg: () => void,
  orgId: number
): React.ReactNode {
  return nodes.map((node) => (
    <TreeItem
      key={node.id}
      label={
        <NextLink href={`/organize/${node.id}`}>
          <Box m={1} sx={{ alignItems: 'center', display: 'inlineFlex' }}>
            <Box mr={1}>
              {orgId == node.id ? (
                <Avatar
                  src={`/api/orgs/${node.id}/avatar`}
                  sx={{ height: '28px', width: '28px' }}
                />
              ) : (
                <ProceduralColorIcon id={node.id} />
              )}
            </Box>
            <Typography
              sx={{ fontWeight: orgId == node.id ? 'bold' : 'normal' }}
              variant="body2"
            >
              {node.title}
            </Typography>
          </Box>
        </NextLink>
      }
      nodeId={node.id.toString()}
      onClick={onSwitchOrg}
    >
      {node.children ? renderTree(node.children, onSwitchOrg, orgId) : ''}
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
        {renderTree(treeItemData, onSwitchOrg, orgId)}
      </TreeView>
    </div>
  );
}

export default OrganizationTree;
