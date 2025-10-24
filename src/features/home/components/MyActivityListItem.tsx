import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { FC } from 'react';

import ZUIItemCard from 'zui/components/ZUIItemCard';
import ZUIIconLabel, { ZUILabelText } from 'zui/components/ZUIIconLabel';
import CardDescription from 'features/organizations/components/CardDescription';

type Props = {
  actions?: JSX.Element[];
  description?: string;
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
  description,
  href,
  iconTitle,
  image,
  info,
  title,
}) => {
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
              <CardDescription
                key={'description'}
                description={description}
                href={href!}
              />,
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
