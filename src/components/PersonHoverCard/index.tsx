import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';
import { useRouter } from 'next/router';
import { Box, Card, Fade, Grid, Popper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

import TagsList from 'components/organize/TagsManager/TagsList';
import ZetkinPerson from 'components/ZetkinPerson';
import { personResource, personTagsResource } from 'api/people';

const PersonHoverCard: React.FunctionComponent<{ personId: number }> = ({
  children,
  personId,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const openPopover = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (anchorEl) {
        setOpen(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [anchorEl]);

  const closePopover = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const { orgId } = useRouter().query;
  const { data: person } = personResource(
    orgId as string,
    personId.toString()
  ).useQuery();
  const { data: tags } = personTagsResource(
    orgId as string,
    personId.toString()
  ).useQuery();

  if (person) {
    return (
      <Box
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        style={{ display: 'flex' }}
      >
        {children}
        <Popper
          anchorEl={anchorEl}
          id="person-hover-card"
          modifiers={{
            preventOverflow: {
              boundariesElement: 'scrollParent',
              enabled: true,
            },
          }}
          open={open}
        >
          <Fade in={open} timeout={200}>
            <Card elevation={5} style={{ padding: 24 }} variant="elevation">
              <Grid
                container
                direction="column"
                spacing={3}
                style={{ width: '25rem' }}
              >
                <Grid item>
                  <ZetkinPerson
                    id={person?.id}
                    name={`${person?.first_name} ${person?.last_name}`}
                  />
                </Grid>
                {tags && (
                  <Grid item>
                    <TagsList isGrouped={false} tags={tags} />
                  </Grid>
                )}
                {person.phone && (
                  <Grid item>
                    <Box display="flex" flexDirection="row">
                      <PhoneIcon
                        color="secondary"
                        style={{ marginRight: '1.5rem' }}
                      />
                      <Typography>{person.phone}</Typography>
                    </Box>
                  </Grid>
                )}
                {person.alt_phone && (
                  <Grid item>
                    <Box display="flex" flexDirection="row">
                      <PhoneIcon
                        color="secondary"
                        style={{ marginRight: '1.5rem' }}
                      />
                      <Typography>{person.alt_phone}</Typography>
                    </Box>
                  </Grid>
                )}
                {person.email && (
                  <Grid item>
                    <Box display="flex" flexDirection="row">
                      <MailIcon
                        color="secondary"
                        style={{ marginRight: '1.5rem' }}
                      />
                      <Typography>{person.email}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Fade>
        </Popper>
      </Box>
    );
  } else {
    return null;
  }
};

export default PersonHoverCard;
