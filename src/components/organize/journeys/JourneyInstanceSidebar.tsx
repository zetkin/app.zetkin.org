import { Add } from '@material-ui/icons';
import { useState } from 'react';
import { Button, ClickAwayListener, Divider, Grid } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import JourneyMilestoneProgress from 'components/organize/journeys/JourneyMilestoneProgress';
import { MUIOnlyPersonSelect as PersonSelect } from 'components/forms/common/PersonSelect';
import ZetkinSection from 'components/ZetkinSection';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'types/zetkin';

const JourneyInstanceSidebar = ({
  journeyInstance,
  onAddAssignee,
}: {
  journeyInstance: ZetkinJourneyInstance;
  onAddAssignee: (person: ZetkinPersonType) => void;
}): JSX.Element => {
  const intl = useIntl();

  const [addingAssignee, setAddingAssignee] = useState<boolean>(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ZetkinSection
          title={intl.formatMessage({
            id: 'pages.organizeJourneyInstance.assignedTo',
          })}
        >
          {!addingAssignee && (
            <Button
              color="primary"
              onClick={() => setAddingAssignee(true)}
              startIcon={<Add />}
              style={{ textTransform: 'uppercase' }}
            >
              <Msg id="pages.organizeJourneyInstance.addAssigneeButton" />
            </Button>
          )}
          {addingAssignee && (
            <ClickAwayListener onClickAway={() => setAddingAssignee(false)}>
              <div>
                <PersonSelect
                  label={intl.formatMessage({
                    id: 'pages.organizeJourneyInstance.assignPersonLabel',
                  })}
                  name="person_id"
                  onChange={(person) => {
                    setAddingAssignee(false);
                    onAddAssignee(person);
                  }}
                  selectedPerson={null}
                  size="small"
                />
              </div>
            </ClickAwayListener>
          )}
        </ZetkinSection>
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
