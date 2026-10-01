import { HeadsetMic } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

const CallassigmentListItem: React.FunctionComponent<{
  callAssignment: ZetkinCallAssignment;
}> = ({ callAssignment }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      href={`/organize/${orgId}/projects/${
        callAssignment.campaign?.id ?? 'standalone'
      }/callassignments/${callAssignment.id}`}
    >
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <HeadsetMic />
            </Avatar>
          </ListItemAvatar>
          <ResultsListItemText primary={callAssignment.title} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default CallassigmentListItem;
