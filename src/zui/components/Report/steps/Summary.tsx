import { FC } from 'react';

import StepBase from './StepBase';

type Props = {
  onEdit: () => void;
  subtitle?: JSX.Element;
  state: 'active' | 'failure' | 'success';
  title: JSX.Element;
};

const Summary: FC<Props> = ({ onEdit, subtitle, state, title }) => {
  return (
    <StepBase onEdit={onEdit} subtitle={subtitle} state={state} title={title} />
  );
};

export default Summary;
