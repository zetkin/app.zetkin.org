import { FC, useMemo } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import messageIds from 'features/surveys/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import theme from 'theme';
import { useEnv } from 'core/hooks';

const ZUIPublicFooter: FC = () => {
  const env = useEnv();
  const messages = useMessages(messageIds);

  const links = useMemo(
    () => [
      {
        href: 'https://zetkin.org/',
        text: messages.surveyFooter.links.foundation(),
      },
      {
        href:
          typeof env.vars.ZETKIN_PRIVACY_POLICY_LINK === 'string'
            ? env.vars.ZETKIN_PRIVACY_POLICY_LINK
            : messages.surveyForm.policy.link(),
        text: messages.surveyFooter.links.privacy(),
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
    [messages]
  );

  return (
    <Box component="footer" px={2} py={8}>
      <Box alignItems="center" display="flex" flexDirection="column">
        <Box flex={1} maxWidth="sm" width="100%">
          <Box pb={4}>
            <Typography
              color={theme.palette.secondary.light}
              component="p"
              fontSize="1rem"
              textAlign="center"
            >
              <Msg id={messageIds.surveyFooter.text} />
            </Typography>
          </Box>
          {typeof env.vars.INSTANCE_OWNER_NAME === 'string' && (
            <Box pb={4}>
              <Typography
                color={theme.palette.secondary.light}
                component="p"
                fontSize="1rem"
                textAlign="center"
              >
                <Msg
                  id={messageIds.surveyFooter.hostingOrganization}
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
              columnGap: theme.spacing(1),
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
                    borderRightColor: theme.palette.divider,
                    borderRightStyle: 'solid',
                    borderRightWidth: 1,
                    paddingRight: theme.spacing(1),
                  },
                  padding: 0,
                  width: 'inherit',
                }}
              >
                <Link
                  href={link.href}
                  style={{ color: theme.palette.secondary.light }}
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
