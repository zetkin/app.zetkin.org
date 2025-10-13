import React, { FC, useMemo } from 'react';
import { Box } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view';
import {
  useTreeItem2,
  UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2GroupTransition,
  TreeItem2IconContainer,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';

import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useMemberships from 'features/organizations/hooks/useMemberships';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';
import ZUILink from 'zui/components/ZUILink';
import { FollowUnfollowLoginButtonDirect } from 'features/organizations/components/ActivistPortlHeader/FollowUnfollowLoginButton';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';

export type OrganizationTreeElement = {
  children?: OrganizationTreeElement[];
  membership: ZetkinMembership | null;
  organization: ZetkinOrganization;
};

export interface StyledTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    React.HTMLAttributes<HTMLLIElement> {
  elem: OrganizationTreeElement;
}

const OrganizationTreeItem = React.forwardRef(function CustomTreeItem(
  props: StyledTreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  const { elem, id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem2({ children, disabled, id, itemId, label, rootRef: ref });

  return (
    <TreeItem2Root {...getRootProps(other)}>
      <TreeItem2Content {...getContentProps()}>
        <TreeItem2IconContainer {...getIconContainerProps()}>
          <TreeItem2Icon status={status} />
        </TreeItem2IconContainer>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            p: 0.5,
            pr: 0,
            userSelect: 'none',
          }}
        >
          <ZUIOrgLogoAvatar orgId={elem.organization.id} />

          <ZUILink
            hoverUnderline={true}
            href={`/o/${elem.organization.id}`}
            text={label}
          />

          {elem.organization.is_open ? (
            <FollowUnfollowLoginButtonDirect
              membership={elem.membership}
              orgId={elem.organization.id}
            />
          ) : undefined}
        </Box>
      </TreeItem2Content>
      {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
    </TreeItem2Root>
  );
});

const OrganizationTreeElementView: FC<{
  elem: OrganizationTreeElement;
}> = ({ elem }) => {
  return (
    <OrganizationTreeItem
      elem={elem}
      itemId={elem.organization.id.toString()}
      label={elem.organization.title}
    >
      {elem.children?.map((child, index) => (
        <OrganizationTreeElementView key={index} elem={child} />
      ))}
    </OrganizationTreeItem>
  );
};

const OrganizationsForest: FC<{
  expanded?: string[];
  forest: OrganizationTreeElement[];
}> = ({ forest, expanded }) => {
  return (
    <Box>
      <SimpleTreeView defaultExpandedItems={expanded}>
        {forest.map((elem, index) => (
          <OrganizationTreeElementView key={index} elem={elem} />
        ))}
      </SimpleTreeView>
    </Box>
  );
};

export default OrganizationsForest;
