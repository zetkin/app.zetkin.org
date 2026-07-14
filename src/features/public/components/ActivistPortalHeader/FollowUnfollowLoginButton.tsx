import { FC } from 'react';

import useUser from 'core/hooks/useUser';
import { useMessages } from 'core/i18n';
import useMembership from 'features/organizations/hooks/useMembership';
import messageIds from 'features/organizations/l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';
import useFollowOrgMutations from 'features/organizations/hooks/useFollowOrgMutations';
import useConnectOrg from 'features/organizations/hooks/useConnectOrg';

type Props = {
  orgId: number;
};

const FollowUnfollowLoginButton: FC<Props> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const user = useUser();
  const membership = useMembership(orgId).data;
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

export default FollowUnfollowLoginButton;
