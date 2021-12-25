/* eslint-disable react-hooks/exhaustive-deps */
import { useIntl } from 'react-intl';
import { ClickAwayListener, FormControl, InputBase, Tooltip } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { useEffect, useRef, useState } from 'react';


const useStyles = makeStyles((theme) => ({
    input: {
        '&:focus, &:hover': {
            borderColor: lighten(theme.palette.primary.main, 0.65 ),
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
    span: {
        // Same styles as input
        '&:focus, &:hover': {
            borderColor: lighten(theme.palette.primary.main, 0.65 ),
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

export interface EditTextinPlaceProps {
    disabled?: boolean;
    onChange: (newValue: string) => Promise<void>;
    value: string;
}

const EditTextinPlace: React.FunctionComponent<EditTextinPlaceProps> = ({ disabled, onChange, value }) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);

    const classes = useStyles();
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const intl = useIntl();

    useEffect(() => {
        // If the value prop changes, set the text
        if (value !== text) {
            setText(text);
        }
    }, [value]);

    useEffect(() => {
        // When the text changes, and when moving in and out of edit mode,
        // transfer the width of an invisible span (which the browser is
        // capable of auto-resizing) to the input.
        if (spanRef.current && inputRef.current) {
            // Add some margin to the right while in edit mode
            const width = spanRef.current.offsetWidth + (editing? 30 : -5);
            inputRef.current.style.width = width + 'px';
        }
    }, [spanRef.current, inputRef.current, editing, text]);

    const startEditing = () => {
        setEditing(true);
        inputRef?.current?.focus();
    };

    const cancelEditing = () => {
        setEditing(false);
        inputRef?.current?.blur();
        // Set text back to value passed in props
        setText(value);
    };

    const submitChange = () => {
        inputRef?.current?.blur();
        setEditing(false);
        onChange(text);
    };

    const onKeyDown = (evt: React.KeyboardEvent) => {
        if (evt.key === 'Enter' && !!text) {
            // If user has not changed the text, do nothing
            if ( text === value) {
                cancelEditing();
            }
            else {
                submitChange();
            }
        }
        else if (evt.key === 'Escape') {
            cancelEditing();
        }
    };

    return (
        <ClickAwayListener onClickAway={ cancelEditing }>
            <Tooltip
                arrow
                disableHoverListener={ editing }
                title={ text ?
                    intl.formatMessage({ id: `misc.components.editTextInPlace.tooltip.${editing ? 'save' : 'edit'}` }) :
                    intl.formatMessage({ id: 'misc.components.editTextInPlace.tooltip.noEmpty' })
                }>
                <FormControl style={{ overflow: 'hidden' }}>
                    <span ref={ spanRef } className={ classes.span }>
                        { text }
                    </span>
                    <InputBase
                        classes={{ input: classes.input, root: classes.inputRoot  }}
                        disabled={ disabled }
                        inputRef={ inputRef }
                        onChange={ (e) => setText(e.target.value) }
                        onFocus={ startEditing }
                        onKeyDown={ onKeyDown }
                        readOnly={ !editing }
                        value={ text }
                    />
                </FormControl>
            </Tooltip>
        </ClickAwayListener>
    );
};

export default EditTextinPlace;
