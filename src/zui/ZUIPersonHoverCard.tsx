import {
  Box,
  BoxProps,
  Button,
  Card,
  Fade,
  Grid,
  Link,
  Popper,
  PopperProps,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';

import { CopyIcon } from './ZUIInlineCopyToClipBoard';
import messageIds from 'features/profile/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagsList from 'features/tags/components/TagManager/components/TagsList';
import { useNumericRouteParams } from 'core/hooks';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTags from 'features/tags/hooks/usePersonTags';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';

const ZUIPersonHoverCard: FC<{
  BoxProps?: BoxProps;
  children: React.ReactNode;
  personId: number;
  popperProps?: Partial<PopperProps>;
}> = ({ BoxProps, children, personId, popperProps }) => {
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
            enabled: true,
            name: 'preventOverflow',
            options: {
              altAxis: true,
              padding: 8,
              tether: true,
            },
          },
        ]}
        open={open}
        style={{ zIndex: 1300 }}
        {...popperProps}
      >
        <Fade in={open} timeout={200}>
          <Box>{open && <HoverCardContent personId={personId} />}</Box>
        </Fade>
      </Popper>
    </Box>
  );
};

const HoverCardContent: FC<{ personId: number }> = ({ personId }) => {
  const { orgId } = useNumericRouteParams();
  const person = usePerson(orgId, personId).data;
  const tags = usePersonTags(orgId, personId).data;

  if (!person) {
    return null;
  }

  return (
    <Card elevation={5} style={{ padding: 24 }} variant="elevation">
      <Grid container direction="column" spacing={2} style={{ width: '25rem' }}>
        <Grid item>
          <ZUIPerson
            id={person?.id}
            link
            name={`${person?.first_name} ${person?.last_name}`}
            subtitle={
              <Typography color="secondary" variant="body2">
                <Msg
                  id={
                    person?.is_user
                      ? messageIds.user.hasAccount
                      : messageIds.user.noAccount
                  }
                />
              </Typography>
            }
            tooltip={false}
          />
        </Grid>
        {tags && (
          <Grid item>
            <TagsList
              cap={10}
              capOverflowHref={`/organize/${orgId}/people/${person?.id}`}
              isGrouped={false}
              tags={tags}
            />
          </Grid>
        )}
        {(['phone', 'alt_phone', 'email'] as Array<keyof ZetkinPerson>)
          .filter((field) => !!person[field])
          .map((field) => {
            const value = person[field];
            const linkType = field.includes('mail')
              ? 'mailto:'
              : field.includes('phone')
              ? 'tel:'
              : '';

            if (typeof value === 'object') {
              return null;
            }
            return (
              <Grid key={field} container item>
                <Box display="flex" flexDirection="row">
                  {field.includes('mail') ? (
                    <MailIcon color="secondary" />
                  ) : (
                    <PhoneIcon color="secondary" />
                  )}
                  <Typography style={{ marginLeft: '1.5rem' }}>
                    <Link href={linkType + value}> {value} </Link>
                  </Typography>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(value as string)
                    }
                    style={{ marginTop: '-0.3rem' }}
                  >
                    <CopyIcon color="secondary" />
                  </Button>
                </Box>
              </Grid>
            );
          })}
      </Grid>
    </Card>
  );
};

export default ZUIPersonHoverCard;
