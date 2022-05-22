import { Add } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Button, List, ListItem, Menu, MenuItem } from '@material-ui/core';

import { journeysResource } from 'api/journeys';
import PersonCard from '../PersonCard';
import { personJourneysResource } from 'api/people';
import ZetkinJourneyInstanceItem from 'components/ZetkinJourneyInstanceItem';
import ZetkinQuery from 'components/ZetkinQuery';

interface PersonJourneysCardProps {
  orgId: string;
  personId: string;
}

const PersonJourneysCard: React.FC<PersonJourneysCardProps> = ({
  orgId,
  personId,
}) => {
  const [addMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const instancesQuery = personJourneysResource(orgId, personId).useQuery();
  const journeysQuery = journeysResource(orgId).useQuery();

  return (
    <ZetkinQuery queries={{ instancesQuery }}>
      {({ queries }) => (
        <PersonCard titleId="pages.people.person.journeys.title">
          <List>
            {queries.instancesQuery.data.map((instance) => (
              <ListItem key={instance.id} divider>
                <ZetkinJourneyInstanceItem
                  instance={instance}
                  orgId={instance.organization.id}
                />
              </ListItem>
            ))}
            <ListItem>
              <ZetkinQuery queries={{ journeysQuery }}>
                {({ queries }) => (
                  <>
                    <Button
                      color="primary"
                      onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}
                      startIcon={<Add />}
                    >
                      <FormattedMessage id="pages.people.person.journeys.addButton" />
                    </Button>
                    <Menu
                      anchorEl={addMenuAnchorEl}
                      onClose={() => setMenuAnchorEl(null)}
                      open={Boolean(addMenuAnchorEl)}
                    >
                      {queries.journeysQuery.data.map((journey) => (
                        <Link
                          key={journey.id}
                          href={`/organize/${journey.organization.id}/journeys/${journey.id}/new?subject=${personId}`}
                          passHref
                        >
                          <MenuItem
                            component="a"
                            onClick={() => setMenuAnchorEl(null)}
                          >
                            {journey.title}
                          </MenuItem>
                        </Link>
                      ))}
                    </Menu>
                  </>
                )}
              </ZetkinQuery>
            </ListItem>
          </List>
        </PersonCard>
      )}
    </ZetkinQuery>
  );
};

export default PersonJourneysCard;
