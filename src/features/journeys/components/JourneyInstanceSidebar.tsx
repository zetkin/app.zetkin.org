import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { Button, ClickAwayListener, Divider, Grid } from '@mui/material';

import JourneyMilestoneProgress from 'features/journeys/components/JourneyMilestoneProgress';
import JourneyPerson from './JourneyPerson';
import { MUIOnlyPersonSelect as PersonSelect } from 'zui/ZUIPersonSelect';
import { TagManagerSection } from 'features/tags/components/TagManager';
import ZUISection from 'zui/ZUISection';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinJourneyInstance,
  ZetkinPerson as ZetkinPersonType,
  ZetkinTag,
} from 'utils/types/zetkin';

import messageIds from '../l10n/messageIds';
import zuiMessageIds from 'zui/l10n/messageIds';

const GridDivider = () => (
  <Grid item xs={12}>
    <Divider />
  </Grid>
);

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
    | 'assignees'
    | 'journey'
    | 'milestones'
    | 'next_milestone'
    | 'subjects'
    | 'tags'
  > & { id?: number };
  onAddAssignee: (person: ZetkinPersonType) => void;
  onAddSubject: (person: ZetkinPersonType) => void;
  onAssignTag: (tag: ZetkinTag) => void;
  onRemoveAssignee: (person: ZetkinPersonType) => void;
  onRemoveSubject: (person: ZetkinPersonType) => void;
  onTagEdited: (tag: ZetkinTag) => void;
  onUnassignTag: (tag: ZetkinTag) => void;
}): JSX.Element => {
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);

  const [addingAssignee, setAddingAssignee] = useState<boolean>(false);
  const [addingSubject, setAddingSubject] = useState<boolean>(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ZUISection
          data-testid="ZetkinSection-assignees"
          title={messages.instance.sections.assigned()}
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
              <Msg id={messageIds.instance.addAssigneeButton} />
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
                  label={messages.instance.assignPersonLabel()}
                  name="person_id"
                  onChange={(person) => {
                    setAddingAssignee(false);
                    onAddAssignee(person);
                  }}
                  selectedPerson={null}
                  size="small"
                  submitLabel={zuiMessages.createPerson.submitLabel.assign()}
                  title={zuiMessages.createPerson.title.assignTo({
                    value: journeyInstance.journey.singular_label,
                  })}
                />
              </div>
            </ClickAwayListener>
          )}
        </ZUISection>
      </Grid>
      <GridDivider />
      <Grid item xs={12}>
        <ZUISection
          data-testid="ZetkinSection-subjects"
          title={messages.instance.sections.members()}
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
              <Msg id={messageIds.instance.addSubjectButton} />
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
                  label={messages.instance.addSubjectLabel()}
                  name="person_id"
                  onChange={(person) => {
                    setAddingSubject(false);
                    onAddSubject(person);
                  }}
                  selectedPerson={null}
                  size="small"
                  submitLabel={zuiMessages.createPerson.submitLabel.add()}
                  title={zuiMessages.createPerson.title.addTo({
                    value: journeyInstance.journey.singular_label,
                  })}
                />
              </div>
            </ClickAwayListener>
          )}
        </ZUISection>
      </Grid>
      <GridDivider />
      <Grid item xs={12}>
        <TagManagerSection
          assignedTags={journeyInstance.tags}
          onAssignTag={onAssignTag}
          onTagEdited={onTagEdited}
          onUnassignTag={onUnassignTag}
        />
      </Grid>
      {journeyInstance.milestones?.length && (
        <>
          <GridDivider />
          <Grid item xs={12}>
            <ZUISection title={messages.instance.sections.milestones()}>
              <JourneyMilestoneProgress
                milestones={journeyInstance.milestones}
                next_milestone={journeyInstance.next_milestone}
              />
            </ZUISection>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default JourneyInstanceSidebar;
