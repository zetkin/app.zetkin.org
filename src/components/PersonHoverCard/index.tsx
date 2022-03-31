import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Card, Popover, Tooltip, Typography } from '@material-ui/core';

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

const PersonHoverCard: React.FunctionComponent<{ personId: string }> = ({
  children,
  personId,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openPopover = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const { orgId } = useRouter().query;
  const { data: person } = personResource(orgId as string, personId).useQuery();
  const { data: tags } = personTagsResource(
    orgId as string,
    personId
  ).useAllTagsQuery();

  if (person) {
    return (
      <Box onMouseEnter={openPopover} style={{ display: 'flex' }}>
        {children}
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
          disableRestoreFocus
          id="person-hover-card"
          onClose={closePopover}
          open={Boolean(anchorEl)}
          transformOrigin={{
            horizontal: 'left',
            vertical: 'bottom',
          }}
        >
          <Card>
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
        </Popover>
      </Box>
    );
  } else {
    return null;
  }
};

export default PersonHoverCard;
