/* eslint-disable jsx-a11y/no-autofocus */
import { TextField } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import ColorPicker from './ColorPicker';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagGroupSelect from './TagGroupSelect';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTagGroup } from 'types/zetkin';
import { NewTagGroup, OnCreateTagHandler } from '../types';

interface TagDialogProps {
  groups: ZetkinTagGroup[];
  open: boolean;
  onClose: () => void;
  onSubmit: OnCreateTagHandler;
  defaultTitle?: string;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  defaultTitle,
  groups,
  open,
  onClose,
  onSubmit,
}) => {
  const intl = useIntl();

  const [title, setTitle] = useState(defaultTitle || '');
  const [titleEdited, setTitleEdited] = useState(false);
  const [color, setColor] = useState<{ valid: boolean; value: string }>({
    valid: true,
    value: '',
  });
  const [group, setGroup] = useState<
    ZetkinTagGroup | NewTagGroup | null | undefined
  >();

  const titleValid = !!title;

  useEffect(() => {
    setTitle(defaultTitle || '');
  }, [defaultTitle]);

  const closeAndClear = () => {
    setTitle('');
    setColor({ valid: true, value: '' });
    setGroup(undefined);
    setTitleEdited(false);
    onClose();
  };

  return (
    <ZetkinDialog
      onClose={closeAndClear}
      open={open}
      title={intl.formatMessage({
        id: 'misc.tags.tagsManager.tagDialog.dialogTitle',
      })}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const tag = {
            color: color.value ? `#${color.value}` : undefined,
            title,
          };
          if (group && 'id' in group) {
            // If existing group, submit with POST body
            onSubmit({
              group_id: group.id,
              ...tag,
            });
          } else if (group && !('id' in group)) {
            // If new group, submit with group object
            onSubmit({
              group,
              ...tag,
            });
          } else {
            // If no group
            onSubmit(tag);
          }
          closeAndClear();
        }}
      >
        <TextField
          error={titleEdited && !titleValid}
          fullWidth
          helperText={
            titleEdited &&
            !titleValid &&
            intl.formatMessage({
              id: 'misc.tags.tagsManager.tagDialog.titleErrorText',
            })
          }
          inputProps={{ 'data-testid': 'TagManager-TagDialog-titleField' }}
          label={intl.formatMessage({
            id: 'misc.tags.tagsManager.tagDialog.titleLabel',
          })}
          margin="normal"
          onChange={(e) => {
            setTitle(e.target.value);
            if (!titleEdited) {
              setTitleEdited(true);
            }
          }}
          onClick={(e) => (e.target as HTMLInputElement).focus()}
          required
          value={title}
          variant="outlined"
        />
        <TagGroupSelect
          groups={groups}
          onChange={(value) => setGroup(value)}
          value={group}
        />
        <ColorPicker
          onChange={(value) => setColor(value)}
          value={color.value}
        />
        <SubmitCancelButtons
          onCancel={closeAndClear}
          submitDisabled={!titleValid || !color.valid}
          submitText={intl.formatMessage({
            id: 'misc.tags.tagsManager.submitCreateTagButton',
          })}
        />
      </form>
    </ZetkinDialog>
  );
};

export default TagDialog;
