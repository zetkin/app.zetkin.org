import { ACTIONS } from '../constants';


export interface DialogContentBaseProps {
    closeDialog: () => void;
}

export interface ActionConfig {
    key: ACTIONS;
    icon: React.ReactNode;
    name: string;
}

export interface Action {
    DialogContent: React.FunctionComponent<DialogContentBaseProps>;
    config: ActionConfig;
}
