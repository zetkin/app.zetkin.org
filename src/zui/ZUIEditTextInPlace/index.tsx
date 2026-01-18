import { Box, lighten, useTheme } from '@mui/material';
import { FormControl, InputBase, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';

export interface ZUIEditTextinPlaceProps {
  allowEmpty?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  onChange: (newValue: string) => void;
  placeholder?: string;
  value: string;
  showBorder?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  tooltipContent?: string;
}

const ZUIEditTextinPlace: React.FunctionComponent<ZUIEditTextinPlaceProps> = ({
  allowEmpty = false,
  disabled,
  readonly,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  showBorder,
  tooltipContent,
  value,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [text, setText] = useState<string>(value);

  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const messages = useMessages(messageIds);
  const theme = useTheme();

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
      if (onBlur) {
        onBlur();
      }
    }
  }, [editing]);

  const startEditing = () => {
    if (!readonly) {
      setEditing(true);
      setBorderOnTypeEdit();
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    // Set text back to value passed in props
    setText(value);
  };

  const submitChange = () => {
    setEditing(false);
    onChange(text);
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

  const handleBlur = () => {
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

  const setBorderOnTypeEdit = () => {
    if (onFocus !== undefined) {
      onFocus();
    }
  };

  const tooltipText = () => {
    if (readonly) {
      return '';
    }
    if (text || allowEmpty) {
      if (editing) {
        if (!text && tooltipContent) {
          return tooltipContent;
        }
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
      <FormControl style={{ overflow: 'hidden' }} variant="standard">
        <Box
          ref={spanRef}
          component="span"
          sx={{
            // Same styles as input
            '&:focus, &:hover': {
              borderColor: lighten(theme.palette.primary.main, 0.65),
              paddingLeft: '10px',
              paddingRight: 0,
            },
            border: '2px dotted transparent',
            borderRadius: '10px',
            paddingRight: '10px',

            // But invisible and positioned absolutely to not affect flow
            position: 'absolute',
            visibility: 'hidden',
          }}
        >
          {text || placeholder}
        </Box>
        <InputBase
          disabled={disabled}
          inputRef={inputRef}
          onBlur={handleBlur}
          onChange={(e) => setText(e.target.value)}
          onFocus={startEditing}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          readOnly={!editing}
          sx={[
            {
              '.MuiInputBase-input': {
                '&:focus, &:hover': {
                  borderColor: `${
                    !readonly ? lighten(theme.palette.primary.main, 0.65) : ''
                  } !important`,
                  paddingLeft: `${!readonly ? 10 : 0}px`,
                  paddingRight: 0,
                },
                border: '2px dotted transparent',
                borderColor: showBorder
                  ? lighten(theme.palette.primary.main, 0.65)
                  : '',
                borderRadius: '10px',
                paddingLeft: `${showBorder ? 10 : 0}px`,
                paddingRight: `${showBorder ? 0 : 10}px`,
                transition: 'all 0.2s ease',
              },
            },
            {
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit !important',
              fontWeight: 'inherit',
            },
          ]}
          value={editing ? text : text || placeholder || ''}
        />
      </FormControl>
    </Tooltip>
  );
};

export default ZUIEditTextinPlace;
