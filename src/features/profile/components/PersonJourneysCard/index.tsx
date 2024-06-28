import { Add } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import { Button, List, ListItem, Menu, MenuItem } from '@mui/material';

import PersonCard from '../PersonCard';
import ZUIJourneyInstanceItem from 'zui/ZUIJourneyInstanceItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/profile/l10n/messageIds';
import useJourneys from 'features/journeys/hooks/useJourneys';
import usePersonJourneyInstances from 'features/journeys/hooks/usePersonJourneyInstances';
import ZUIFuture from 'zui/ZUIFuture';

interface PersonJourneysCardProps {
  orgId: number;
  personId: number;
}

const PersonJourneysCard: React.FC<PersonJourneysCardProps> = ({
  orgId,
  personId,
}) => {
  const messages = useMessages(messageIds);
  const [addMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const instancesFuture = usePersonJourneyInstances(orgId, personId);
  const journeysFuture = useJourneys(orgId);

  return (
    <ZUIFuture future={instancesFuture}>
      {(instances) => (
        <PersonCard title={messages.journeys.title()}>
          <List data-testid="PersonJourneysCard-list" disablePadding>
            {instances
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
              <ZUIFuture future={journeysFuture}>
                {(journeys) => (
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
                      {journeys.map((journey) => (
                        <Link
                          key={journey.id}
                          href={`/organize/${journey.organization.id}/journeys/${journey.id}/new?subject=${personId}`}
                          legacyBehavior
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
              </ZUIFuture>
            </ListItem>
          </List>
        </PersonCard>
      )}
    </ZUIFuture>
  );
};

export default PersonJourneysCard;
