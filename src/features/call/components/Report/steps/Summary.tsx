import { FC } from 'react';

import StepBase from './StepBase';

type Props = {
  onEdit: () => void;
  state: 'active' | 'failure' | 'success';
  subtitle?: JSX.Element;
  title: JSX.Element;
};

const Summary: FC<Props> = ({ onEdit, subtitle, state, title }) => {
  return (
    <StepBase onEdit={onEdit} state={state} subtitle={subtitle} title={title} />
  );
};

export default Summary;
