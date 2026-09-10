import { FC, ReactNode } from 'react';
import { NoSsr } from '@mui/material';

type Props = {
  children: ReactNode;
};

const CanvassLayout: FC<Props> = ({ children }) => {
  return <NoSsr>{children}</NoSsr>;
};

export default CanvassLayout;
