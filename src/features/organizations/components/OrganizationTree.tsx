import NextLink from 'next/link';
import ProceduralColorIcon from './ProceduralColorIcon';
import React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { TreeItemData } from '../rpc/getOrganizations';
import TreeView from '@mui/lab/TreeView';
import { Avatar, Box, Typography } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';

interface OrganizationTreeProps {
  treeItemData: TreeItemData[];
  orgId: number;
}

function renderTree(nodes: TreeItemData[], orgId: number): React.ReactNode {
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
    >
      {node.children ? renderTree(node.children, orgId) : ''}
    </TreeItem>
  ));
}

function OrganizationTree({
  treeItemData,
  orgId,
}: OrganizationTreeProps): JSX.Element {
  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
      >
        {renderTree(treeItemData, orgId)}
      </TreeView>
    </div>
  );
}

export default OrganizationTree;
