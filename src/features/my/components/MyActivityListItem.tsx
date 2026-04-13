import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC } from 'react';

import ZUIItemCard from 'zui/components/ZUIItemCard';
import ZUIIconLabel, { ZUILabelText } from 'zui/components/ZUIIconLabel';

type Props = {
  actions?: JSX.Element[];
  href?: string;
  iconTitle?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  image?: string;
  info: {
    Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
    labels: ZUILabelText[];
  }[];
  title: string;
};

const MyActivityListItem: FC<Props> = ({
  actions,
  href,
  iconTitle,
  image,
  info,
  title,
}) => {
  return (
    <ZUIItemCard
      actions={actions}
      content={info.map((item, index) => (
        <ZUIIconLabel
          key={index}
          color="secondary"
          icon={item.Icon}
          label={item.labels}
          size="small"
        />
      ))}
      href={href}
      {...(iconTitle ? { icon: iconTitle } : {})}
      src={image}
      title={title}
    />
  );
};

export default MyActivityListItem;
