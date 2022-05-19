import { Add } from '@material-ui/icons';
import { useState } from 'react';
import { Button, ClickAwayListener, Divider, Grid } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import JourneyMilestoneProgress from 'components/organize/journeys/JourneyMilestoneProgress';
import JourneyPerson from './JourneyPerson';
import { MUIOnlyPersonSelect as PersonSelect } from 'components/forms/common/PersonSelect';
import { TagManagerSection } from '../TagManager';
import ZetkinSection from 'components/ZetkinSection';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
  ZetkinTag,
} from 'types/zetkin';

const JourneyInstanceSidebar = ({
  journeyInstance,
  onAddAssignee,
  onAssignTag,
  onAddSubject,
  onRemoveAssignee,
  onRemoveSubject,
  onTagEdited,
  onUnassignTag,
}: {
  journeyInstance: Pick<
    ZetkinJourneyInstance,
    'assignees' | 'milestones' | 'next_milestone' | 'subjects' | 'tags'
  > & { id?: number };
  onAddAssignee: (person: ZetkinPersonType) => void;
  onAddSubject: (person: ZetkinPersonType) => void;
  onAssignTag: (tag: ZetkinTag) => void;
  onRemoveAssignee: (person: ZetkinPersonType) => void;
  onRemoveSubject: (person: ZetkinPersonType) => void;
  onTagEdited: (tag: ZetkinTag) => void;
  onUnassignTag: (tag: ZetkinTag) => void;
}): JSX.Element => {
  const intl = useIntl();

  const [addingAssignee, setAddingAssignee] = useState<boolean>(false);
  const [addingSubject, setAddingSubject] = useState<boolean>(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ZetkinSection
          data-testid="ZetkinSection-assignees"
          title={intl.formatMessage({
            id: 'pages.organizeJourneyInstance.sections.assigned',
          })}
        >
          {journeyInstance.assignees.map((assignee, index) => (
            <JourneyPerson
              key={index}
              onRemove={onRemoveAssignee}
              person={assignee}
            />
          ))}
          {!addingAssignee && (
            <Button
              color="primary"
              data-testid="Button-add-assignee"
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
                  data-testid="PersonSelect-add-assignee"
                  getOptionDisabled={(option) => {
                    return journeyInstance.assignees
                      .map((a) => a.id)
                      .includes(option.id);
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
          data-testid="ZetkinSection-subjects"
          title={intl.formatMessage({
            id: 'pages.organizeJourneyInstance.sections.members',
          })}
        >
          {journeyInstance.subjects.map((member, index) => (
            <JourneyPerson
              key={index}
              onRemove={onRemoveSubject}
              person={member}
            />
          ))}
          {!addingSubject && (
            <Button
              color="primary"
              data-testid="Button-add-subject"
              onClick={() => setAddingSubject(true)}
              startIcon={<Add />}
              style={{ textTransform: 'uppercase' }}
            >
              <Msg id="pages.organizeJourneyInstance.addSubjectButton" />
            </Button>
          )}
          {addingSubject && (
            <ClickAwayListener onClickAway={() => setAddingSubject(false)}>
              <div>
                <PersonSelect
                  getOptionDisabled={(option) => {
                    return journeyInstance.subjects
                      .map((s) => s.id)
                      .includes(option.id);
                  }}
                  label={intl.formatMessage({
                    id: 'pages.organizeJourneyInstance.addSubjectLabel',
                  })}
                  name="person_id"
                  onChange={(person) => {
                    setAddingSubject(false);
                    onAddSubject(person);
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
        <TagManagerSection
          assignedTags={journeyInstance.tags}
          onAssignTag={onAssignTag}
          onTagEdited={onTagEdited}
          onUnassignTag={onUnassignTag}
        />
        <Divider />
      </Grid>
      {journeyInstance.milestones && (
        <Grid item xs={12}>
          <ZetkinSection
            title={intl.formatMessage({
              id: 'pages.organizeJourneyInstance.sections.milestones',
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
