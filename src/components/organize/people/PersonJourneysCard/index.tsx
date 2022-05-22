import PersonCard from '../PersonCard';
import { personJourneysResource } from 'api/people';
import ZetkinJourneyInstanceItem from 'components/ZetkinJourneyInstanceItem';
import ZetkinQuery from 'components/ZetkinQuery';
import { List, ListItem } from '@material-ui/core';

interface PersonJourneysCardProps {
  orgId: string;
  personId: string;
}

const PersonJourneysCard: React.FC<PersonJourneysCardProps> = ({
  orgId,
  personId,
}) => {
  const instancesQuery = personJourneysResource(orgId, personId).useQuery();

  return (
    <ZetkinQuery queries={{ instancesQuery }}>
      {({ queries }) => (
        <PersonCard titleId="pages.people.person.journeys.title">
          <List>
            {queries.instancesQuery.data.map((instance) => (
              <ListItem key={instance.id}>
                <ZetkinJourneyInstanceItem instance={instance} />
              </ListItem>
            ))}
          </List>
        </PersonCard>
      )}
    </ZetkinQuery>
  );
};

export default PersonJourneysCard;
