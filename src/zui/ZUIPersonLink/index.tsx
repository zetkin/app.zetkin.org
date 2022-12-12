import { Link } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonHoverCard from '../ZUIPersonHoverCard';

interface ZUIPersonLinkProps {
  person: Pick<ZetkinPerson, 'id' | 'first_name' | 'last_name'>;
}
const ZUIPersonLink: React.FC<ZUIPersonLinkProps> = ({ person }) => {
  const { orgId } = useRouter().query;

  return (
    <ZUIPersonHoverCard
      BoxProps={{ style: { display: 'inline-flex' } }}
      personId={Number(person.id)}
    >
      <NextLink href={`/organize/${orgId}/people/${person.id}`} passHref>
        <Link
          color="textPrimary"
          style={{ fontWeight: 'bold' }}
          underline="hover"
        >
          {person.first_name + ' ' + person.last_name}
        </Link>
      </NextLink>
    </ZUIPersonHoverCard>
  );
};

export default ZUIPersonLink;
