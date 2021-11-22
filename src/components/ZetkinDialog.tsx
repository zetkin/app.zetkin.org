import { FunctionComponent } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@material-ui/core';


interface ZetkinDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
}

const ZetkinDialog: FunctionComponent<ZetkinDialogProps> = ({ children, open, onClose, title }): JSX.Element => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog fullScreen={ fullScreen } fullWidth onClose={ onClose } open={ open }>
            <Box p={ 2 }>
                { title &&
                    <DialogTitle>
                        { title }
                    </DialogTitle>
                }
                <DialogContent>
                    { children }
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default ZetkinDialog;
