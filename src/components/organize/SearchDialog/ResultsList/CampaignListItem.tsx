import Link from 'next/link';
import { useRouter } from 'next/router';
import { ListItem, ListItemText } from '@material-ui/core';

import { ZetkinCampaign } from 'types/zetkin';

const CampaignListItem: React.FunctionComponent<{
  campaign: ZetkinCampaign;
}> = ({ campaign }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      key={campaign.id}
      href={`/organize/${orgId}/campaigns/${campaign.id}`}
      passHref
    >
      <ListItem button component="a">
        <ListItemText>{campaign.title}</ListItemText>
      </ListItem>
    </Link>
  );
};

export default CampaignListItem;
