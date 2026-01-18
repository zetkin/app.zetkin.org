import NextLink from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { Breadcrumb } from 'utils/types';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useBreadcrumbElements from '../hooks/useBreadcrumbs';
import oldTheme from 'theme';

function validMessageId(
  idStr: string
): keyof typeof messageIds.elements | null {
  if (idStr in messageIds.elements) {
    return idStr as keyof typeof messageIds.elements;
  } else {
    return null;
  }
}

const BreadcrumbTrail = ({
  highlight,
}: {
  highlight?: boolean;
}): JSX.Element | null => {
  const breadcrumbs = useBreadcrumbElements();
  const smallScreen = useMediaQuery('(max-width:700px)');

  const mediumScreen = useMediaQuery('(max-width:960px)');
  const largeScreen = useMediaQuery('(max-width:1200px)');

  const getLabel = (crumb: Breadcrumb) => {
    if (crumb.labelMsg) {
      const msgId = validMessageId(crumb.labelMsg);
      if (msgId) {
        return <Msg id={messageIds.elements[msgId]} />;
      }
    }

    return crumb.label;
  };

  return (
    <Box
      sx={{
        [oldTheme.breakpoints.down('sm')]: {
          width: '100%',
        },
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        itemsAfterCollapse={smallScreen ? 1 : mediumScreen ? 2 : 3}
        itemsBeforeCollapse={smallScreen ? 1 : mediumScreen ? 2 : 3}
        maxItems={smallScreen ? 2 : mediumScreen ? 4 : largeScreen ? 6 : 10}
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          minHeight: '24px',
        }}
      >
        {breadcrumbs.map((crumb: Breadcrumb, index: number) => {
          if (index < breadcrumbs.length - 1) {
            return (
              <NextLink
                key={crumb.href}
                href={crumb.href}
                legacyBehavior
                passHref
              >
                <Link
                  color="inherit"
                  sx={{
                    display: 'block',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'font-size 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  underline="hover"
                >
                  {getLabel(crumb)}
                </Link>
              </NextLink>
            );
          } else {
            return (
              <Typography
                key={crumb.href}
                sx={{
                  p: {
                    fontWeight: highlight ? 'bolder' : 'inherit',
                  },
                }}
              >
                {getLabel(crumb)}
              </Typography>
            );
          }
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbTrail;
