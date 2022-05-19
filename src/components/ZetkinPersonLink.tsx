import { Link } from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import PersonHoverCard from './PersonHoverCard';
import { ZetkinPerson } from 'types/zetkin';

interface ZetkinPersonLinkProps {
  person: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
}
const ZetkinPersonLink: React.FC<ZetkinPersonLinkProps> = ({ person }) => {
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

export default ZetkinPersonLink;
