import { SvgIconTypeMap } from '@mui/material';
import Image from 'next/image';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC, ReactNode } from 'react';

import ZUIItemCard from 'zui/components/ZUIItemCard';
import ZUIIconLabel from 'zui/components/ZUIIconLabel';

type Props = {
  actions?: ReactNode[];
  image?: string;
  info: {
    Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
    labels: string[];
  }[];
  title: string;
};

const MyActivityListItem: FC<Props> = ({ actions, image, info, title }) => {
  return (
    <ZUIItemCard
      description={[
        ...info.map((item, index) => {
          return (
            <ZUIIconLabel key={index} icon={item.Icon} label={item.labels} />
          );
        }),
        ...(actions || []),
      ]}
      image={
        image ? (
          <Image
            alt={title}
            src={image}
            style={{ height: '100%', objectFit: 'cover', width: '100%' }}
          />
        ) : undefined
      }
      title={title}
    />
  );
};

export default MyActivityListItem;
