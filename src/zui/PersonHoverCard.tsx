import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';
import { useRouter } from 'next/router';
import {
  Box,
  BoxProps,
  Card,
  Fade,
  Grid,
  Popper,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

import CopyToClipboard from 'components/CopyToClipboard';
import TagsList from 'features/tags/components/TagManager/components/TagsList';
import ZetkinPerson from 'components/ZetkinPerson';
import { ZetkinPerson as ZetkinPersonType } from 'utils/types/zetkin';
import {
  personResource,
  personTagsResource,
} from 'features/profile/api/people';

const PersonHoverCard: React.FunctionComponent<{
  BoxProps?: BoxProps;
  personId: number;
}> = ({ BoxProps, children, personId }) => {
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
  ).useQuery({ enabled: Boolean(anchorEl) });
  const { data: tags } = personTagsResource(
    orgId as string,
    personId.toString()
  ).useQuery({ enabled: Boolean(anchorEl) });

  return (
    <Box
      onMouseEnter={openPopover}
      onMouseLeave={closePopover}
      style={{ display: 'flex' }}
      {...BoxProps}
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
        {person && (
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
                    link
                    name={`${person?.first_name} ${person?.last_name}`}
                    tooltip={false}
                  />
                </Grid>
                {tags && (
                  <Grid item>
                    <TagsList isGrouped={false} tags={tags} />
                  </Grid>
                )}
                {(
                  ['phone', 'alt_phone', 'email'] as Array<
                    keyof ZetkinPersonType
                  >
                )
                  .filter((field) => !!person[field])
                  .map((field) => (
                    <Grid key={field} container item>
                      <CopyToClipboard copyText={person[field] as string}>
                        <Box display="flex" flexDirection="row">
                          {field.includes('mail') ? (
                            <MailIcon color="secondary" />
                          ) : (
                            <PhoneIcon color="secondary" />
                          )}
                          <Typography style={{ marginLeft: '1.5rem' }}>
                            {person[field]}
                          </Typography>
                        </Box>
                      </CopyToClipboard>
                    </Grid>
                  ))}
              </Grid>
            </Card>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default PersonHoverCard;
