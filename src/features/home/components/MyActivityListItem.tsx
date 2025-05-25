import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC } from 'react';

import ZUIItemCard from 'zui/components/ZUIItemCard';
import ZUIIconLabel from 'zui/components/ZUIIconLabel';

type Props = {
  actions?: JSX.Element[];
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
      {...(iconTitle ? { icon: iconTitle } : {})}
      src={image}
      title={title}
    />
  );
};

export default MyActivityListItem;
