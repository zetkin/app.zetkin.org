import { ACTIONS } from '../../../../components/ZetkinSpeedDial/constants';

export interface DialogContentBaseProps {
  closeDialog: () => void;
}

export interface ActionConfig {
  key: ACTIONS;
  icon: React.ReactNode;
  name: string;
  urlKey: string;
}

export interface Action {
  DialogContent: React.FunctionComponent<DialogContentBaseProps>;
  config: ActionConfig;
}
