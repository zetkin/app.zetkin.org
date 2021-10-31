import { FunctionComponent } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';


interface ZetkinDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
}

const ZetkinDialog: FunctionComponent<ZetkinDialogProps> = ({ children, open, onClose, title }): JSX.Element => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog fullScreen={ fullScreen } fullWidth onClose={ onClose } open={ open }>
            <Box p={ 2 }>
                <DialogTitle>
                    { title || null }
                </DialogTitle>
                <DialogContent>
                    { children }
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default ZetkinDialog;
