import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { ZetkinVisitAssignee } from 'features/visitassignments/types';
import TagManager from 'features/tags/components/TagManager';
import { useMessages } from 'core/i18n';
import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import messageIds from 'features/visitassignments/l10n/messageIds';

interface AssigneeConfigDialogProps {
  assignee: ZetkinVisitAssignee | null;
  onClose: () => void;
  onSubmit: (prioTags: ZetkinTag[], excludedTags: ZetkinTag[]) => void;
  open: boolean;
}

const AssigneeConfigDialog: FC<AssigneeConfigDialogProps> = ({
  assignee,
  onClose,
  onSubmit,
  open,
}) => {
  const messages = useMessages(messageIds);
  const [prioTags, setPrioTags] = useState<ZetkinAppliedTag[]>([]);
  const [excludedTags, setExcludedTags] = useState<ZetkinAppliedTag[]>([]);

  useEffect(() => {
    if (assignee) {
      setPrioTags(assignee.prioritized_tags);
      setExcludedTags(assignee.excluded_tags);
    }
  }, [assignee]);

  return (
    <ZUIDialog
      onClose={onClose}
      open={open}
      title={
        assignee
          ? messages.assignees.customize.title({
              name: `${assignee.first_name} ${assignee.last_name}`,
            })
          : ''
      }
    >
      {assignee && (
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSubmit(prioTags, excludedTags);
          }}
        >
          <AssigneeTagSection
            onChange={setPrioTags}
            subtitle={messages.assignees.customize.prioritize.intro()}
            tags={prioTags}
            title={messages.assignees.customize.prioritize.h()}
          />
          <AssigneeTagSection
            onChange={setExcludedTags}
            subtitle={messages.assignees.customize.exclude.intro()}
            tags={excludedTags}
            title={messages.assignees.customize.exclude.h()}
          />
          <ZUISubmitCancelButtons onCancel={onClose} />
        </form>
      )}
    </ZUIDialog>
  );
};

const useStyles = makeStyles(() => ({
  subtitle: {
    marginBottom: '0.5em',
  },
  title: {
    fontSize: '1em',
    fontWeight: 'bold',
    marginTop: '1em',
  },
}));

const AssigneeTagSection: FC<{
  onChange: (tags: ZetkinAppliedTag[]) => void;
  subtitle: string;
  tags: ZetkinAppliedTag[];
  title: string;
}> = ({ onChange, subtitle, tags, title }) => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.title} variant="h3">
        {title}
      </Typography>
      <Typography className={classes.subtitle} variant="body1">
        {subtitle}
      </Typography>
      <TagManager
        assignedTags={tags}
        groupTags={false}
        ignoreValues={true}
        onAssignTag={(tag) => onChange(tags.concat([tag]))}
        onUnassignTag={(tag) => onChange(tags.filter((t) => t.id != tag.id))}
      />
    </>
  );
};

export default AssigneeConfigDialog;
