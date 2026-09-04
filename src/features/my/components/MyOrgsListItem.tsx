import { FC, useState } from 'react';

import { ZetkinMembership } from 'utils/types/zetkin';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIItemCard from 'zui/components/ZUIItemCard';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useFollowOrgMutations from 'features/organizations/hooks/useFollowOrgMutations';

type Props = {
  membership: ZetkinMembership;
};

const MyOrgsListItem: FC<Props> = ({ membership }) => {
  const [followLoading, setFollowLoading] = useState(false);
  const { follow, organization, role } = membership;
  const messages = useMessages(messageIds);
  const { followOrg, unfollowOrg } = useFollowOrgMutations(organization.id);

  const actions: JSX.Element[] = [];

  if (follow) {
    actions.push(
      <ZUIButton
        key="unfollow"
        isLoading={followLoading}
        label={messages.myOrgs.unfollowButton()}
        onClick={async () => {
          setFollowLoading(true);
          await unfollowOrg();
          setFollowLoading(false);
        }}
        variant="secondary"
      />
    );
  } else {
    actions.push(
      <ZUIButton
        key="follow"
        isLoading={followLoading}
        label={messages.myOrgs.followButton()}
        onClick={async () => {
          setFollowLoading(true);
          await followOrg(membership);
          setFollowLoading(false);
        }}
        variant="primary"
      />
    );
  }

  if (role) {
    actions.push(
      <ZUIButton
        key="organize"
        href={`/organize/${organization.id}`}
        label={messages.myOrgs.organizeButton()}
        variant="tertiary"
      />
    );
  }

  return (
    <ZUIItemCard
      actions={actions}
      avatar={`/api/orgs/${organization.id}/avatar`}
      href={`/o/${organization.id}`}
      title={organization.title}
    />
  );
};

export default MyOrgsListItem;
