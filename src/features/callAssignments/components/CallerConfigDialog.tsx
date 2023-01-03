import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { FC, useEffect, useState } from 'react';

import { CallAssignmentCaller } from '../apiTypes';
import TagManager from 'features/tags/components/TagManager';
import { ZetkinTag } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

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
  const intl = useIntl();
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
          ? intl.formatMessage(
              { id: 'pages.organizeCallAssignment.callers.customize.title' },
              { name: `${caller.first_name} ${caller.last_name}` }
            )
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
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.callers.customize.prioritize.intro',
            })}
            tags={prioTags}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.callers.customize.prioritize.h',
            })}
          />
          <CallerTagSection
            onChange={setExcludedTags}
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.callers.customize.exclude.intro',
            })}
            tags={excludedTags}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.callers.customize.exclude.h',
            })}
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
