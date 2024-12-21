import { FC } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import SurveyContainer from './SurveyContainer';
import theme from 'theme';

const links = [
  {
    href: 'https://zetkin.org/',
    text: messageIds.surveyFooter.links.foundation,
  },
  {
    href: 'https://manual.zetkin.org/',
    text: messageIds.surveyFooter.links.manual,
  },
  {
    href: 'https://zetkin.org/privacy',
    text: messageIds.surveyFooter.links.privacy,
  },
];

const SurveyFooter: FC = () => {
  return (
    <Box px={2} py={8}>
      <SurveyContainer>
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
        <Box display="flex" justifyContent="center" py={4}>
          <Image
            alt="Zetkin Foundation"
            className="Footer-logo"
            height={64}
            src="/logo-zetkin.png"
            width={64}
          />
        </Box>
        <List
          sx={{
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
                '&:not(:last-child)::after': {
                  color: theme.palette.secondary.light,
                  content: '"|"',
                  margin: '0 8px',
                },
                padding: 0,
                width: 'inherit',
              }}
            >
              <Link
                href={link.href}
                style={{ color: theme.palette.secondary.light }}
              >
                <Msg id={link.text} />
              </Link>
            </ListItem>
          ))}
        </List>
      </SurveyContainer>
    </Box>
  );
};

export default SurveyFooter;
