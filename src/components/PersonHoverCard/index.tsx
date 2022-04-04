import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';
import { useRouter } from 'next/router';
import { Box, Card, Popper, Tooltip, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

import ZetkinPerson from 'components/ZetkinPerson';
import { ZetkinTag } from 'types/zetkin';
import { personResource, personTagsResource } from 'api/people';

const TagChip: React.FunctionComponent<{ tag: ZetkinTag }> = ({ tag }) => {
  return (
    <Tooltip arrow title={tag.description}>
      <Box
        bgcolor={tag.color || '#e1e1e1'}
        borderRadius="18px"
        fontSize={13}
        px={2}
        py={0.7}
      >
        {tag.title}
      </Box>
    </Tooltip>
  );
};

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
    }, 500);
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
          <Card elevation={5} variant="elevation">
            <Box m={2} width="25rem">
              <ZetkinPerson
                id={person?.id}
                name={`${person?.first_name} ${person?.last_name}`}
              />
              {tags && (
                //filter for only non-hidden tags?
                <Box display="flex" flexDirection="row" pt={1}>
                  {tags.map((tag, index) => (
                    <TagChip key={index} tag={tag} />
                  ))}
                </Box>
              )}
              {person.phone && (
                <Box display="flex" flexDirection="row" pl="1rem" pt="1.5rem">
                  <PhoneIcon
                    color="secondary"
                    style={{ marginRight: '1.5rem' }}
                  />
                  <Typography>{person.phone}</Typography>
                </Box>
              )}
              {person.alt_phone && (
                <Box display="flex" flexDirection="row" pl="1rem" pt="1.5rem">
                  <PhoneIcon
                    color="secondary"
                    style={{ marginRight: '1.5rem' }}
                  />
                  <Typography>{person.alt_phone}</Typography>
                </Box>
              )}
              {person.email && (
                <Box display="flex" flexDirection="row" pl="1rem" pt="1.5rem">
                  <MailIcon
                    color="secondary"
                    style={{ marginRight: '1.5rem' }}
                  />
                  <Typography>{person.email}</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Popper>
      </Box>
    );
  } else {
    return null;
  }
};

export default PersonHoverCard;
