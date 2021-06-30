import { FunctionComponent } from 'react';
import { Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@material-ui/core';


interface ZetkinDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
}

const ZetKinDialog: FunctionComponent<ZetkinDialogProps> = ({ children, open, onClose, title }): JSX.Element => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog fullScreen={ fullScreen } fullWidth onClose={ onClose } open={ open } style={{ maxHeight: '80vh' }}>
            <DialogTitle>
                { title || null }
            </DialogTitle>
            <DialogContent>
                { children }
            </DialogContent>
        </Dialog>
    );
};

export default ZetKinDialog;
