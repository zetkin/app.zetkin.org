import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { FC, Fragment, ReactNode } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type Props = {
  Icon?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> | null;
  actions?: ReactNode[];
  href?: string;
  image?: string;
  info: {
    Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
    labels: ReactNode[];
  }[];
  title: string;
};

const MyActivityListItem: FC<Props> = ({
  actions,
  href,
  Icon,
  image,
  info,
  title,
}) => {
  const card = (
    <Card>
      {image && (
        <CardMedia>
          <Box height={100} position="relative" width="100%">
            <Image alt="" fill src={image} style={{ objectFit: 'cover' }} />
          </Box>
        </CardMedia>
      )}
      <CardContent sx={{ pb: 0 }}>
        <Box display="flex" gap={1} pb={0.4}>
          {Icon && (
            <Box textAlign="center" width="1.4rem">
              <Icon color="secondary" />
            </Box>
          )}
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Box
          sx={(theme) => ({
            color: theme.palette.grey[600],
          })}
        >
          {info.map((item, index) => {
            return (
              <Box key={index} display="flex" gap={1}>
                <Box textAlign="center" width="1.4rem">
                  <item.Icon
                    color="inherit"
                    fontSize="small"
                    sx={{ opacity: 0.5 }}
                  />
                </Box>
                {item.labels
                  .filter((label) => !!label)
                  .map((label, index) => {
                    const isFirst = index == 0;

                    return (
                      <Fragment key={index}>
                        {!isFirst && <Typography variant="body2">·</Typography>}
                        {typeof label == 'string' ? (
                          <Typography
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            variant="body2"
                          >
                            {label}
                          </Typography>
                        ) : (
                          label
                        )}
                      </Fragment>
                    );
                  })}
              </Box>
            );
          })}
        </Box>
      </CardContent>
      {actions && (
        <CardActions sx={{ gap: 1, justifyContent: 'start', pb: 2, px: 2 }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Box sx={{ cursor: 'pointer' }}>{card}</Box>
    </Link>
  ) : (
    card
  );
};

export default MyActivityListItem;
