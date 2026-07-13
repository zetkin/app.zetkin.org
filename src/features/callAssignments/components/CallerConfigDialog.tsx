import { Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { CallAssignmentCaller } from '../apiTypes';
import TagManager from 'features/tags/components/TagManager';
import { useMessages } from 'core/i18n';
import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';
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
  const [prioTags, setPrioTags] = useState<ZetkinAppliedTag[]>([]);
  const [excludedTags, setExcludedTags] = useState<ZetkinAppliedTag[]>([]);

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

const CallerTagSection: FC<{
  onChange: (tags: ZetkinAppliedTag[]) => void;
  subtitle: string;
  tags: ZetkinAppliedTag[];
  title: string;
}> = ({ onChange, subtitle, tags, title }) => {
  return (
    <>
      <Typography
        sx={{
          fontSize: '1em',
          fontWeight: 'bold',
          marginTop: '1em',
        }}
        variant="h3"
      >
        {title}
      </Typography>
      <Typography
        sx={{
          marginBottom: '0.5em',
        }}
        variant="body1"
      >
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
