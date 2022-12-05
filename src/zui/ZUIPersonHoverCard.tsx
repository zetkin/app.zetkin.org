import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import { useRouter } from 'next/router';
import {
  Box,
  BoxProps,
  Card,
  Fade,
  Grid,
  Popper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import TagsList from 'features/tags/components/TagManager/components/TagsList';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUICopyToClipboard from 'zui/ZUICopyToClipboard';
import ZUIPerson from 'zui/ZUIPerson';
import {
  personResource,
  personTagsResource,
} from 'features/profile/api/people';

const ZUIPersonHoverCard: React.FunctionComponent<{
  BoxProps?: BoxProps;
  children: React.ReactNode;
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
        modifiers={[
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
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
                  <ZUIPerson
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
                {(['phone', 'alt_phone', 'email'] as Array<keyof ZetkinPerson>)
                  .filter((field) => !!person[field])
                  .map((field) => {
                    const value = person[field];
                    if (typeof value === 'object') {
                      return null;
                    }
                    return (
                      <Grid key={field} container item>
                        <ZUICopyToClipboard copyText={value as string}>
                          <Box display="flex" flexDirection="row">
                            {field.includes('mail') ? (
                              <MailIcon color="secondary" />
                            ) : (
                              <PhoneIcon color="secondary" />
                            )}
                            <Typography style={{ marginLeft: '1.5rem' }}>
                              {value}
                            </Typography>
                          </Box>
                        </ZUICopyToClipboard>
                      </Grid>
                    );
                  })}
              </Grid>
            </Card>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default ZUIPersonHoverCard;
