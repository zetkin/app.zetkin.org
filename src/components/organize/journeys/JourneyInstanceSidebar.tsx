import { useIntl } from 'react-intl';
import { Divider, Grid } from '@material-ui/core';

import JourneyMilestoneProgress from 'components/organize/journeys/JourneyMilestoneProgress';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinSection from 'components/ZetkinSection';

const JourneyInstanceSidebar = ({
  journeyInstance,
}: {
  journeyInstance: ZetkinJourneyInstance;
}): JSX.Element => {
  const intl = useIntl();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ZetkinSection
          title={intl.formatMessage({
            id: 'pages.organizeJourneyInstance.assignedTo',
          })}
        ></ZetkinSection>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <ZetkinSection
          title={intl.formatMessage({
            id: 'pages.organizeJourneyInstance.members',
          })}
        ></ZetkinSection>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <ZetkinSection
          title={intl.formatMessage({
            id: 'pages.organizeJourneyInstance.tags',
          })}
        ></ZetkinSection>
        <Divider />
      </Grid>
      {journeyInstance.milestones && (
        <Grid item xs={12}>
          <ZetkinSection
            title={intl.formatMessage({
              id: 'pages.organizeJourneyInstance.milestones',
            })}
          >
            <JourneyMilestoneProgress
              milestones={journeyInstance.milestones}
              next_milestone={journeyInstance.next_milestone}
            />
          </ZetkinSection>
          <Divider />
        </Grid>
      )}
    </Grid>
  );
};

export default JourneyInstanceSidebar;
