import { HeadsetMic } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

const CallassigmentListItem: React.FunctionComponent<{
  callAssignment: ZetkinCallAssignment;
}> = ({ callAssignment }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      key={callAssignment.id}
      href={`/organize/${orgId}/projects/${
        callAssignment.campaign?.id ?? 'standalone'
      }/callassignments/${callAssignment.id}`}
      passHref
    >
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar>
            <HeadsetMic />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={callAssignment.title}
          secondary={<Msg id={messageIds.results.callassignment} />}
        />
      </ListItem>
    </Link>
  );
};

export default CallassigmentListItem;
