import { Add } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import { Button, List, ListItem, Menu, MenuItem } from '@mui/material';

import { journeysResource } from 'features/journeys/api/journeys';
import PersonCard from '../PersonCard';
import { personJourneysResource } from 'features/profile/api/people';
import ZUIJourneyInstanceItem from 'zui/ZUIJourneyInstanceItem';
import ZUIQuery from 'zui/ZUIQuery';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/profile/l10n/messageIds';

interface PersonJourneysCardProps {
  orgId: string;
  personId: string;
}

const PersonJourneysCard: React.FC<PersonJourneysCardProps> = ({
  orgId,
  personId,
}) => {
  const messages = useMessages(messageIds);
  const [addMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const instancesQuery = personJourneysResource(orgId, personId).useQuery();
  const journeysQuery = journeysResource(orgId).useQuery();

  return (
    <ZUIQuery queries={{ instancesQuery }}>
      {({ queries }) => (
        <PersonCard title={messages.journeys.title()}>
          <List data-testid="PersonJourneysCard-list" disablePadding>
            {queries.instancesQuery.data
              .sort((i0, i1) => Number(!!i0.closed) - Number(!!i1.closed))
              .map((instance) => (
                <ListItem key={instance.id} button divider>
                  <ZUIJourneyInstanceItem
                    instance={instance}
                    orgId={instance.organization.id}
                  />
                </ListItem>
              ))}
            <ListItem>
              <ZUIQuery queries={{ journeysQuery }}>
                {({ queries }) => (
                  <>
                    <Button
                      color="primary"
                      data-testid="PersonJourneysCard-addButton"
                      onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}
                      startIcon={<Add />}
                    >
                      <Msg id={messageIds.journeys.addButton} />
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
              </ZUIQuery>
            </ListItem>
          </List>
        </PersonCard>
      )}
    </ZUIQuery>
  );
};

export default PersonJourneysCard;
