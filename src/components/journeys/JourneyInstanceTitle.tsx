import { Typography } from '@material-ui/core';

import { ZetkinJourneyInstance } from 'types/zetkin';

interface JourneyInstanceTitleProps {
  instance: ZetkinJourneyInstance;
}

const JourneyInstanceTitle: React.FC<JourneyInstanceTitleProps> = ({
  instance,
}) => {
  // TODO: Use instance.journey.singular_label instead, but requires API change
  const title = instance.title || instance.journey.title;

  return (
    <>
      <Typography style={{ marginRight: '0.5em' }}>{title}</Typography>
      <Typography color="secondary">#{instance.id}</Typography>
    </>
  );
};

export default JourneyInstanceTitle;
