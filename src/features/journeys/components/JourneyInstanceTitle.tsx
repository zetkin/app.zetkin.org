import NextLink from 'next/link';
import { Link, Typography } from '@mui/material';

import { ZetkinJourneyInstance } from 'utils/types/zetkin';

interface JourneyInstanceTitleProps {
  instance: ZetkinJourneyInstance;
  link?: boolean;
}

const JourneyInstanceTitle: React.FC<JourneyInstanceTitleProps> = ({
  instance,
  link,
}) => {
  const title = instance.title || instance.journey.singular_label;

  const titleElem = (
    <Typography component="span" style={{ marginRight: '0.5em' }}>
      {title}
    </Typography>
  );

  if (link) {
    return (
      <NextLink
        href={`/organize/${instance.organization.id}/journeys/${instance.journey.id}/${instance.id}`}
        legacyBehavior
        passHref
      >
        <Link color="inherit" underline="hover">
          {titleElem}
        </Link>
      </NextLink>
    );
  } else {
    return titleElem;
  }
};

export default JourneyInstanceTitle;
