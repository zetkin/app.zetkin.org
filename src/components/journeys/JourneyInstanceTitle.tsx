import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';

import { ZetkinJourneyInstance } from 'types/zetkin';

interface JourneyInstanceTitleProps {
  instance: ZetkinJourneyInstance;
  link?: boolean;
}

const JourneyInstanceTitle: React.FC<JourneyInstanceTitleProps> = ({
  instance,
  link,
}) => {
  // TODO: Use instance.journey.singular_label instead, but requires API change
  const title = instance.title || instance.journey.title;

  const titleElem = (
    <Typography component="span" style={{ marginRight: '0.5em' }}>
      {title}
    </Typography>
  );

  const idElem = (
    <Typography color="secondary" component="span">
      #{instance.id}
    </Typography>
  );

  if (link) {
    return (
      <NextLink
        href={`/organize/${instance.organization.id}/journeys/${instance.journey.id}/${instance.id}`}
        passHref
      >
        <Link color="inherit">
          {titleElem}
          {idElem}
        </Link>
      </NextLink>
    );
  } else {
    return (
      <>
        {titleElem}
        {idElem}
      </>
    );
  }
};

export default JourneyInstanceTitle;
