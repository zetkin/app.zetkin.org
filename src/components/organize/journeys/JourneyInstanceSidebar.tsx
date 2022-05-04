import { grey } from '@material-ui/core/colors';
import { useState } from 'react';
import { Add, Close } from '@material-ui/icons';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Grid,
} from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import JourneyMilestoneProgress from 'components/organize/journeys/JourneyMilestoneProgress';
import { MUIOnlyPersonSelect as PersonSelect } from 'components/forms/common/PersonSelect';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinSection from 'components/ZetkinSection';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
} from 'types/zetkin';

const JourneyInstanceSidebar = ({
  journeyInstance,
  onAddAssignee,
  onRemoveAssignee,
}: {
  journeyInstance: ZetkinJourneyInstance;
  onAddAssignee: (person: ZetkinPersonType) => void;
  onRemoveAssignee: (person: ZetkinPersonType) => void;
}): JSX.Element => {
  const intl = useIntl();

  const [addingAssignee, setAddingAssignee] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ZetkinSection
          title={intl.formatMessage({
            id: 'pages.organizeJourneyInstance.assignedTo',
          })}
        >
          {journeyInstance.assignees.map((assignee, index) => (
            <Box
              key={index}
              alignItems="center"
              bgcolor={hover ? grey[200] : ''}
              display="flex"
              justifyContent="space-between"
              onClick={() => onRemoveAssignee(assignee)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              p={1}
            >
              <ZetkinPerson
                id={assignee.id}
                name={`${assignee.first_name} ${assignee.last_name}`}
              />
              {hover && <Close color="secondary" />}
            </Box>
          ))}
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
                  getOptionDisabled={(option) => {
                    if (journeyInstance.assignees.length > 0) {
                      return !journeyInstance.assignees.includes(option);
                    } else {
                      return false;
                    }
                  }}
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
