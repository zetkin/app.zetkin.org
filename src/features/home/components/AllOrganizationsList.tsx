import React, { FC, useMemo } from 'react';
import { Box } from '@mui/material';

import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useMemberships from 'features/organizations/hooks/useMemberships';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';
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
import ZUILink from 'zui/components/ZUILink';
import { FollowUnfollowLoginButtonDirect } from 'features/organizations/components/ActivistPortlHeader/FollowUnfollowLoginButton';
import ZUIOrgLogoAvatar from '../../../zui/components/ZUIOrgLogoAvatar';

type OrganizationTreeElement = {
  children?: OrganizationTreeElement[];
  membership: ZetkinMembership | null;
  organization: ZetkinOrganization;
};

interface StyledTreeItemProps
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
      itemId={elem.organization.id.toString()}
      label={elem.organization.title}
      elem={elem}
    >
      {elem.children?.map((child, index) => (
        <OrganizationTreeElementView key={index} elem={child} />
      ))}
    </OrganizationTreeItem>
  );
};

const OrganizationsList: FC<{
  memberships: ZetkinMembership[];
  organizations: ZetkinOrganization[];
}> = ({ memberships, organizations }) => {
  const { organizationForest, idList } = useMemo(() => {
    const filteredOrgs = organizations.filter((org) => org.is_public);

    const orgMap: { [key: number]: OrganizationTreeElement } = {};

    filteredOrgs.forEach((org) => {
      orgMap[org.id] = {
        children: [],
        membership: null,
        organization: org,
      };
    });

    const rootOrgs: OrganizationTreeElement[] = [];
    const idList: string[] = [];

    filteredOrgs.forEach((org) => {
      if (org.parent) {
        orgMap[org.parent.id].children.push(orgMap[org.id]);
      } else {
        rootOrgs.push(orgMap[org.id]);
      }
      idList.push(org.id.toString());
    });

    memberships.forEach((mem) => {
      orgMap[mem.organization.id].membership = mem;
    });

    return {
      idList: idList,
      organizationForest: rootOrgs,
    };
  }, [organizations, memberships]);

  return (
    <Box>
      <SimpleTreeView defaultExpandedItems={idList}>
        {organizationForest.map((elem, index) => (
          <OrganizationTreeElementView key={index} elem={elem} />
        ))}
      </SimpleTreeView>
    </Box>
  );
};

const AllOrganizationsList: FC = () => {
  const organizationsFuture = useOrganizations();
  const membershipsFuture = useMemberships(true);

  return (
    <ZUIFutures
      futures={{
        memberships: membershipsFuture,
        organizations: organizationsFuture,
      }}
    >
      {({
        data,
      }: {
        data: {
          memberships: ZetkinMembership[];
          organizations: ZetkinOrganization[];
        };
      }) => (
        <OrganizationsList
          memberships={data.memberships}
          organizations={data.organizations}
        />
      )}
    </ZUIFutures>
  );
};

export default AllOrganizationsList;
