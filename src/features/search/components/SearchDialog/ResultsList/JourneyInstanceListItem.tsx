import { Explore } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';

import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const JourneyInstanceListItem: React.FunctionComponent<{ journeyInstance: ZetkinJourneyInstance }> = ({
  journeyInstance,
}) => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  return (
    <Link href={`/organize/${orgId}/journeys/${journeyInstance.journey.id}/${journeyInstance.id}`} passHref>
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar>
            <Explore />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={journeyInstance.journey.title}
          secondary={journeyInstance.title}
        />
      </ListItem>
    </Link>
  );
};

export default JourneyInstanceListItem;