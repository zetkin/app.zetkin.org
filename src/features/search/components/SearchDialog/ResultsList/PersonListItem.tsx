import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinPerson } from 'utils/types/zetkin';
import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

const PersonListItem: React.FunctionComponent<{ person: ZetkinPerson }> = ({
  person,
}) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link href={`/organize/${orgId}/people/${person.id}`}>
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar src={`/api/orgs/${orgId}/people/${person.id}/avatar`} />
          </ListItemAvatar>
          <ResultsListItemText
            primary={person.first_name + ' ' + person.last_name}
            secondary={<Msg id={messageIds.results.person} />}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default PersonListItem;
