import { ACTIONS } from '../constants';

export interface SpeedDialActionConfig {
    key: ACTIONS;
    icon: React.ReactNode;
    name: string;
}

export interface DialogContentBaseProps {
    closeDialog: () => void;
}
