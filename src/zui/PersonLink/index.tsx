import { Link } from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import PersonHoverCard from '../../molecules/PersonHoverCard';
import { ZetkinPerson } from 'utils/types/zetkin';

interface PersonLinkProps {
  person: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
}
const PersonLink: React.FC<PersonLinkProps> = ({ person }) => {
  const { orgId } = useRouter().query;

  return (
    <PersonHoverCard
      BoxProps={{ style: { display: 'inline-flex' } }}
      personId={Number(person.id)}
    >
      <NextLink href={`/organize/${orgId}/people/${person.id}`} passHref>
        <Link color="textPrimary" style={{ fontWeight: 'bold' }}>
          {person.first_name + ' ' + person.last_name}
        </Link>
      </NextLink>
    </PersonHoverCard>
  );
};

export default PersonLink;
