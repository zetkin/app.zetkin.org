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

function renderTree(props: OrganizationTreeProps): React.ReactNode {
  const { treeItemData, orgId, onSwitchOrg } = props;
  return treeItemData.map((item) => (
    <TreeItem
      key={item.id}
      label={
        <NextLink href={`/organize/${item.id}`}>
          <Box m={1} sx={{ alignItems: 'center', display: 'inlineFlex' }}>
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
