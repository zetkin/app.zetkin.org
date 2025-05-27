import { FC } from 'react';

import StepBase from './StepBase';

type Props = {
  onClick: () => void;
  subtitle?: JSX.Element;
  title: JSX.Element;
};

const Summary: FC<Props> = ({ onClick, subtitle, title }) => {
  return <StepBase onEdit={onClick} subtitle={subtitle} title={title} />;
};

export default Summary;
