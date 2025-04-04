'use client';

import { FC } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import NextLink from 'next/link';

import usePublicSubOrgs from '../hooks/usePublicSubOrgs';
import ZUIAvatar from 'zui/ZUIAvatar';

type Props = {
  orgId: number;
};

const SubOrgsPage: FC<Props> = ({ orgId }) => {
  const allSubOrgs = usePublicSubOrgs(orgId);
  const subOrgs = allSubOrgs.filter((org) => org.parent?.id == orgId);

  return (
    <List>
      {subOrgs.map((org) => {
        const hasSubOrgs = !!allSubOrgs.find(
          (subOrg) => subOrg.parent?.id == org.id
        );

        const baseUrl = `/o/${org.id}`;
        const url = hasSubOrgs ? baseUrl + '/suborgs' : baseUrl;

        return (
          <ListItem key={org.id}>
            <NextLink
              href={url}
              style={{
                display: 'block',
                textDecoration: 'none',
                width: '100%',
              }}
            >
              <Box
                sx={(theme) => ({
                  alignItems: 'center',
                  color: theme.palette.text.primary,
                  display: 'flex',
                  gap: 1,
                  textDecoration: 'none',
                })}
              >
                <ZUIAvatar size="md" url={`/api/orgs/${org.id}/avatar`} />
                <Typography>{org.title}</Typography>
                <Box sx={{ lineHeight: '1em', marginLeft: 'auto' }}>
                  {hasSubOrgs && <ChevronRight />}
                </Box>
              </Box>
            </NextLink>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SubOrgsPage;
