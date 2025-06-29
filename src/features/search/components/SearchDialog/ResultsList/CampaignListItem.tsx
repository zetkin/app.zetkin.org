import { Event } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinCampaign } from 'utils/types/zetkin';
import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

const CampaignListItem: React.FunctionComponent<{
  campaign: ZetkinCampaign;
}> = ({ campaign }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link key={campaign.id} href={`/organize/${orgId}/projects/${campaign.id}`}>
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <Event />
            </Avatar>
          </ListItemAvatar>
          <ResultsListItemText
            primary={campaign.title}
            secondary={<Msg id={messageIds.results.project} />}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default CampaignListItem;
