import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { CallAssignmentCaller } from '../apiTypes';
import TagManager from 'features/tags/components/TagManager';
import { useMessages } from 'core/i18n';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import messageIds from '../l10n/messageIds';

interface CallerConfigDialogProps {
  caller: CallAssignmentCaller | null;
  onClose: () => void;
  onSubmit: (prioTags: ZetkinTag[], excludedTags: ZetkinTag[]) => void;
  open: boolean;
}

const CallerConfigDialog: FC<CallerConfigDialogProps> = ({
  caller,
  onClose,
  onSubmit,
  open,
}) => {
  const messages = useMessages(messageIds);
  const [prioTags, setPrioTags] = useState<ZetkinTag[]>([]);
  const [excludedTags, setExcludedTags] = useState<ZetkinTag[]>([]);

  useEffect(() => {
    if (caller) {
      setPrioTags(caller.prioritized_tags);
      setExcludedTags(caller.excluded_tags);
    }
  }, [caller]);

  return (
    <ZUIDialog
      onClose={onClose}
      open={open}
      title={
        caller
          ? messages.callers.customize.title({
              name: `${caller.first_name} ${caller.last_name}`,
            })
          : ''
      }
    >
      {caller && (
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSubmit(prioTags, excludedTags);
          }}
        >
          <CallerTagSection
            onChange={setPrioTags}
            subtitle={messages.callers.customize.prioritize.intro()}
            tags={prioTags}
            title={messages.callers.customize.prioritize.h()}
          />
          <CallerTagSection
            onChange={setExcludedTags}
            subtitle={messages.callers.customize.exclude.intro()}
            tags={excludedTags}
            title={messages.callers.customize.exclude.h()}
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

const CallerTagSection: FC<{
  onChange: (tags: ZetkinTag[]) => void;
  subtitle: string;
  tags: ZetkinTag[];
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

export default CallerConfigDialog;
