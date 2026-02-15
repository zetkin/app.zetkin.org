import { FC, useMemo } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import messageIds from 'zui/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import oldTheme from 'theme';
import { useEnv } from 'core/hooks';

const ZUIPublicFooter: FC = () => {
  const env = useEnv();
  const messages = useMessages(messageIds);

  const links = useMemo(
    () => [
      {
        href: 'https://zetkin.org/',
        text: messages.publicFooter.links.foundation(),
      },
      {
        href:
          typeof env.vars.ZETKIN_PRIVACY_POLICY_LINK === 'string'
            ? env.vars.ZETKIN_PRIVACY_POLICY_LINK
            : messages.privacyPolicyLink(),
        text: messages.publicFooter.links.privacy(),
      },
      ...(typeof env.vars.INSTANCE_OWNER_NAME === 'string' &&
      typeof env.vars.INSTANCE_OWNER_HREF === 'string'
        ? [
            {
              href: env.vars.INSTANCE_OWNER_HREF as string,
              text: env.vars.INSTANCE_OWNER_NAME as string,
            },
          ]
        : []),
    ],
    [
      messages,
      env.vars.ZETKIN_PRIVACY_POLICY_LINK,
      env.vars.INSTANCE_OWNER_NAME,
      env.vars.INSTANCE_OWNER_HREF,
    ]
  );

  return (
    <Box component="footer" px={2} py={8}>
      <Box alignItems="center" display="flex" flexDirection="column">
        <Box flex={1} maxWidth="sm" width="100%">
          <Box pb={4}>
            <Typography
              color={oldTheme.palette.secondary.light}
              component="p"
              fontSize="1rem"
              textAlign="center"
            >
              <Msg id={messageIds.publicFooter.text} />
            </Typography>
          </Box>
          {typeof env.vars.INSTANCE_OWNER_NAME === 'string' && (
            <Box pb={4}>
              <Typography
                color={oldTheme.palette.secondary.light}
                component="p"
                fontSize="1rem"
                textAlign="center"
              >
                <Msg
                  id={messageIds.publicFooter.hostingOrganization}
                  values={{
                    name: env.vars.INSTANCE_OWNER_NAME,
                  }}
                />
              </Typography>
            </Box>
          )}
          <Box display="flex" justifyContent="center" py={4}>
            <Image
              alt=""
              className="Footer-logo"
              height={64}
              src="/logo-zetkin.png"
              width={64}
            />
          </Box>
          <List
            sx={{
              columnGap: oldTheme.spacing(1),
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {links.map((link) => (
              <ListItem
                key={link.href}
                sx={{
                  '&:not(:last-child)': {
                    borderRightColor: oldTheme.palette.divider,
                    borderRightStyle: 'solid',
                    borderRightWidth: 1,
                    paddingRight: oldTheme.spacing(1),
                  },
                  padding: 0,
                  width: 'inherit',
                }}
              >
                <Link
                  href={link.href}
                  style={{ color: oldTheme.palette.secondary.light }}
                  target="_blank"
                >
                  {link.text}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default ZUIPublicFooter;
