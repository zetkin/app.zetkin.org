import { Box, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC } from 'react';

import ZUIItemCard from 'zui/components/ZUIItemCard';
import ZUIIconLabel from 'zui/components/ZUIIconLabel';
import ZUIText from '../../../zui/components/ZUIText';
import ZUIButton from '../../../zui/components/ZUIButton';
import { useMessages } from '../../../core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  actions?: JSX.Element[];
  description?: string;
  href?: string;
  iconTitle?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  image?: string;
  info: {
    Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
    labels: string[];
  }[];
  title: string;
};

const MyActivityListItem: FC<Props> = ({
  actions,
  href,
  iconTitle,
  image,
  info,
  description,
  title,
}) => {
  const messages = useMessages(messageIds);

  return (
    <ZUIItemCard
      actions={actions}
      content={[
        ...info.map((item, index) => (
          <ZUIIconLabel
            key={index}
            color="secondary"
            icon={item.Icon}
            label={item.labels}
            size="small"
          />
        )),
        ...(description
          ? [
              <Box>
                <ZUIText
                  key={'description'}
                  color="primary"
                  sx={{
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    display: '-webkit-box',
                    overflow: 'hidden',
                  }}
                  variant="bodySmRegular"
                >
                  {description}
                </ZUIText>
                <ZUIButton
                  label={messages.allEventsList.descriptionReadMore()}
                  href={href}
                />
              </Box>,
            ]
          : []),
      ]}
      href={href}
      {...(iconTitle ? { icon: iconTitle } : {})}
      src={image}
      title={title}
    />
  );
};

export default MyActivityListItem;
