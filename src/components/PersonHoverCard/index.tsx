import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';
import { useRouter } from 'next/router';
import { Box, Card, Fade, Grid, Popper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

import CopyToClipboard from 'components/CopyToClipboard';
import TagsList from 'components/organize/TagsManager/TagsList';
import ZetkinPerson from 'components/ZetkinPerson';
import { ZetkinPerson as ZetkinPersonType } from 'types/zetkin';
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
                spacing={2}
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
                {['phone', 'alt_phone', 'email']
                  .filter((field) => !!person[field as keyof ZetkinPersonType])
                  .map((field) => (
                    <Grid key={field} container item>
                      <CopyToClipboard
                        copyText={person[field as keyof ZetkinPersonType]}
                      >
                        <Box display="flex" flexDirection="row">
                          {field.includes('mail') ? (
                            <MailIcon color="secondary" />
                          ) : (
                            <PhoneIcon color="secondary" />
                          )}
                          <Typography style={{ marginLeft: '1.5rem' }}>
                            {person[field as keyof ZetkinPersonType]}
                          </Typography>
                        </Box>
                      </CopyToClipboard>
                    </Grid>
                  ))}
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
