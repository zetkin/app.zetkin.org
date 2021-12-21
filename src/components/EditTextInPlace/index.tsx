import Alert from '@material-ui/lab/Alert';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ClickAwayListener, FormControl, InputBase, InputLabel, Snackbar, Tooltip } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { lighten, makeStyles } from '@material-ui/core/styles';

interface ComponentProps {
    defaultText: string;
    label: string;
    onSubmit: (arg: string) => Promise<boolean>;
    text: string;
}

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
}));


const EditTextinPlace: React.FunctionComponent<ComponentProps> = ({ label, text, onSubmit, defaultText }) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<'success' | 'error'>();
    const [newText, setNewText] = useState<string>(text);
    const classes = useStyles();
    const inputRef = useRef<HTMLInputElement>(null);
    const intl = useIntl();

    const intlIds = {
        alert: `misc.components.editTextInPlace.alert.${snackbar || 'error'}`,
        noEmpty: 'misc.components.editTextInPlace.noEmpty',
        tooltip: `misc.components.editTextInPlace.tooltip.${editing ? 'save' : 'edit'}`,
    };

    useEffect(() => {
        if (text !== newText) setNewText(text);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    const onRequestEdit = async () => {
        await setEditing(true);
        inputRef?.current?.focus();
        if (text === defaultText) setNewText('');
    };
    const onCancelEdit = () => {
        setEditing(false);
        inputRef?.current?.blur();
        setNewText(text);
    };
    const onChange = (evt: ChangeEvent<HTMLInputElement> ) => {
        setNewText(evt.target.value);
    };
    const onKeyDown = (evt: React.KeyboardEvent) => {
        if (evt.key === 'Enter' && !!newText) {
            if ( newText === text) onCancelEdit();
            else if ( newText !== text) submitChange();
        }
    };
    const submitChange = (override?: string) => {
        inputRef?.current?.blur();
        setEditing(false);
        setDisabled(true);
        onSubmit(override || newText).then((success) => {
            setSnackbar(success ? 'success' : 'error');
            setDisabled(false);
        });

    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                autoHideDuration={ 3000 }
                onClose={ () => setSnackbar(undefined) }
                open={ !!snackbar }>
                <Alert onClose={ () => setSnackbar(undefined) } severity={ snackbar }>
                    { snackbar && intl.formatMessage({ id: intlIds.alert },{ label }) }
                </Alert>
            </Snackbar>
            <ClickAwayListener onClickAway={ onCancelEdit }>
                <Tooltip
                    arrow
                    disableHoverListener={ editing }
                    title={ intl.formatMessage({ id: intlIds.tooltip },{ label }) }>
                    <FormControl error={ !newText }>
                        <InputLabel variant="standard">
                            { !newText && <FormattedMessage id={ intlIds.noEmpty } /> }
                        </InputLabel>
                        <InputBase
                            classes={{ input: classes.input, root: classes.inputRoot  }}
                            disabled={ disabled }
                            inputProps={{ size: Math.max(defaultText.length, newText?.length) }}
                            inputRef={ inputRef }
                            onChange={ onChange }
                            onFocus={ onRequestEdit }
                            onKeyDown={ onKeyDown }
                            readOnly={ !editing } value={ newText }
                        />
                    </FormControl>
                </Tooltip>
            </ClickAwayListener>
        </>);
};

export default EditTextinPlace;
