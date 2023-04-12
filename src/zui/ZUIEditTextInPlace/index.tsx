import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, InputBase, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';

const useStyles = makeStyles((theme) => ({
  input: {
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderRadius: 10,
    paddingRight: 10,
    transition: 'all 0.2s ease',
  },
  inputRoot: {
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit !important',
    fontWeight: 'inherit',
  },
  showBorder: {
    border: '2px dotted transparent',
    borderColor: lighten(theme.palette.primary.main, 0.65),
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 0,
    transition: 'all 0.2s ease',
  },
  span: {
    // Same styles as input
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderRadius: 10,
    paddingRight: 10,

    // But invisible and positioned absolutely to not affect flow
    position: 'absolute',
    visibility: 'hidden',
  },
}));

export interface ZUIEditTextinPlaceProps {
  allowEmpty?: boolean;
  disabled?: boolean;
  onChange: (newValue: string) => void;
  placeholder?: string;
  value: string;
  showBorder?: boolean;
  setShowBorder?: (value: boolean) => void;
}

const ZUIEditTextinPlace: React.FunctionComponent<ZUIEditTextinPlaceProps> = ({
  allowEmpty = false,
  disabled,
  onChange,
  placeholder,
  setShowBorder,
  showBorder,
  value,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [text, setText] = useState<string>(value);

  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const messages = useMessages(messageIds);

  useEffect(() => {
    // If the value prop changes, set the text
    if (value !== text) {
      setText(value);
    }
  }, [value]);

  useEffect(() => {
    // When the text changes, and when moving in and out of edit mode,
    // transfer the width of an invisible span (which the browser is
    // capable of auto-resizing) to the input.
    if (spanRef.current && inputRef.current) {
      // Add some margin to the right while in edit mode
      const width = spanRef.current.offsetWidth + (editing ? 30 : -5);
      inputRef.current.style.width = width + 'px';
    }
  }, [spanRef.current, inputRef.current, editing, text]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [editing]);

  const startEditing = () => {
    setEditing(true);
    setBorderOnTypeEdit(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    // Set text back to value passed in props
    setText(value);
  };

  const submitChange = () => {
    setEditing(false);
    onChange(text);
    setBorderOnTypeEdit(false);
  };

  const onKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && (!!text || allowEmpty)) {
      // If user has not changed the text, do nothing
      if (text === value) {
        cancelEditing();
      } else {
        submitChange();
      }
    } else if (evt.key === 'Escape') {
      cancelEditing();
    }
  };

  const onBlur = () => {
    if (editing) {
      if (!!text || allowEmpty) {
        if (text === value) {
          cancelEditing();
        } else {
          submitChange();
        }
      }
    }
  };

  const setBorderOnTypeEdit = (value: boolean) => {
    if (setShowBorder !== undefined) {
      setShowBorder(value);
    }
  };

  const tooltipText = () => {
    if (text || allowEmpty) {
      if (editing) {
        return '';
      } else {
        return messages.editTextInPlace.tooltip.edit();
      }
    } else {
      return messages.editTextInPlace.tooltip.noEmpty();
    }
  };

  return (
    <Tooltip
      arrow
      disableHoverListener={editing}
      placement="top"
      title={tooltipText()}
    >
      <FormControl
        onClick={(e) => e.stopPropagation()}
        style={{ overflow: 'hidden' }}
        variant="standard"
      >
        <span ref={spanRef} className={classes.span}>
          {text || placeholder}
        </span>
        <InputBase
          classes={{
            input: showBorder ? classes.showBorder : classes.input,
            root: classes.inputRoot,
          }}
          disabled={disabled}
          inputRef={inputRef}
          onBlur={onBlur}
          onChange={(e) => setText(e.target.value)}
          onFocus={startEditing}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          readOnly={!editing}
          value={text}
        />
      </FormControl>
    </Tooltip>
  );
};

export default ZUIEditTextinPlace;
