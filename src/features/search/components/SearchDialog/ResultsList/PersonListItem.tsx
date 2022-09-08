import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@material-ui/core';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinPerson } from 'utils/types/zetkin';

const PersonListItem: React.FunctionComponent<{ person: ZetkinPerson }> = ({
  person,
}) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      key={person.id}
      href={`/organize/${orgId}/people/${person.id}`}
      passHref
    >
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar src={`/api/orgs/${orgId}/people/${person.id}/avatar`} />
        </ListItemAvatar>
        <ResultsListItemText
          primary={person.first_name + ' ' + person.last_name}
          secondary={'Person'}
        />
      </ListItem>
    </Link>
  );
};

export default PersonListItem;
