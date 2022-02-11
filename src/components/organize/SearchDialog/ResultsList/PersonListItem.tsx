import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

import { ZetkinPerson } from 'types/zetkin';

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
      <ListItem button component="a">
        <ListItemAvatar>
          <Avatar src={`/api/orgs/${orgId}/people/${person.id}/avatar`} />
        </ListItemAvatar>
        <ListItemText>
          {person.first_name} {person.last_name}
        </ListItemText>
      </ListItem>
    </Link>
  );
};

export default PersonListItem;
