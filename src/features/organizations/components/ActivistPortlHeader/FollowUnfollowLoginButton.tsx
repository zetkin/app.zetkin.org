import { FC } from 'react';

import useUser from 'core/hooks/useUser';
import { useMessages } from 'core/i18n';
import useMembership from 'features/organizations/hooks/useMembership';
import messageIds from 'features/organizations/l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';
import useFollowOrgMutations from 'features/organizations/hooks/useFollowOrgMutations';
import useConnectOrg from 'features/organizations/hooks/useConnectOrg';
import { ZetkinMembership } from 'utils/types/zetkin';

export const FollowUnfollowLoginButtonDirect: FC<{
  membership: ZetkinMembership | null;
  orgId: number;
}> = ({ orgId, membership }) => {
  const user = useUser();
  const messages = useMessages(messageIds);
  const { followOrg, unfollowOrg } = useFollowOrgMutations(orgId);
  const { connectOrg } = useConnectOrg(orgId);

  return (
    <>
      {user && membership?.follow && (
        <ZUIButton
          label={messages.home.header.unfollow()}
          onClick={() => unfollowOrg()}
          size="small"
          variant="secondary"
        />
      )}
      {user && membership?.follow === false && (
        <ZUIButton
          label={messages.home.header.follow()}
          onClick={() => followOrg(membership)}
          size="small"
          variant="primary"
        />
      )}
      {user && !membership && (
        <ZUIButton
          label={messages.home.header.connect()}
          onClick={() => connectOrg()}
          size="small"
          variant="primary"
        />
      )}
      {!user && (
        <ZUIButton
          href={`/login?redirect=${encodeURIComponent(`/o/${orgId}`)}`}
          label={messages.home.header.login()}
          size="small"
          variant="primary"
        />
      )}
    </>
  );
};

type Props = {
  orgId: number;
};

const FollowUnfollowLoginButton: FC<Props> = ({ orgId }) => {
  const membership = useMembership(orgId).data;

  return (
    <FollowUnfollowLoginButtonDirect orgId={orgId} membership={membership} />
  );
};

export default FollowUnfollowLoginButton;
