import { Box } from '@mui/material';
import { FC } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';

import ZUIText from 'zui/components/ZUIText';
import ZUITabbedNavBar, {
  ZUITabbedNavBarProps,
} from 'zui/components/ZUITabbedNavBar';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import useUser from 'core/hooks/useUser';

type Props = {
  button?: JSX.Element;
  imageUrl?: string;
  selectedTab?: string;
  subtitle?: string | JSX.Element;
  tabs?: ZUITabbedNavBarProps['items'];
  title: string | JSX.Element;
  topLeftComponent?: JSX.Element;
};

const ActivistPortalHeader: FC<Props> = ({
  imageUrl,
  tabs,
  button,
  selectedTab,
  subtitle,
  title,
  topLeftComponent,
}) => {
  const user = useUser();

  const hasNavBar = selectedTab && tabs;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 2,
          width: '100%',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: topLeftComponent ? 'space-between' : 'flex-end',
          }}
        >
          {topLeftComponent}
          {user && (
            <NextLink href="/my">
              <ZUIPersonAvatar
                firstName={user.first_name}
                id={user.id}
                isUser
                lastName={user.last_name}
              />
            </NextLink>
          )}
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {typeof title == 'string' ? (
              <ZUIText variant="headingLg">{title}</ZUIText>
            ) : (
              title
            )}
          </Box>
          {button && button}
        </Box>
        {subtitle && (
          <Box>
            {typeof subtitle == 'string' ? (
              <ZUIText>{subtitle}</ZUIText>
            ) : (
              subtitle
            )}
          </Box>
        )}
      </Box>
      {imageUrl && (
        <Image
          alt=""
          height={480}
          src={imageUrl}
          style={{
            height: '100%',
            objectFit: 'cover',
            width: '100%',
          }}
          width={960}
        />
      )}
      {hasNavBar && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <ZUITabbedNavBar items={tabs} selectedTab={selectedTab} />
        </Box>
      )}
    </Box>
  );
};

export default ActivistPortalHeader;
