'use client';

import { FC } from 'react';
import { Box, List, ListItem } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import NextLink from 'next/link';

import usePublicSubOrgs from '../hooks/usePublicSubOrgs';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  orgId: number;
};

const SubOrgsPage: FC<Props> = ({ orgId }) => {
  const allSubOrgs = usePublicSubOrgs(orgId);
  const subOrgsSorted = allSubOrgs
    .filter((org) => org.parent?.id === orgId)
    .sort((so1, so2) => {
      return so1.title.localeCompare(so2.title);
    });

  return (
    <List>
      {subOrgsSorted.map((org) => {
        const hasSubOrgs = !!allSubOrgs.find(
          (subOrg) => subOrg.parent?.id === org.id
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
                <ZUIText>{org.title}</ZUIText>
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
