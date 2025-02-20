import { FC } from 'react';
import { Box, Card, Divider } from '@mui/material';

import JoinFormListItem from './JoinFormListItem';
import { ZetkinJoinForm } from '../types';

type Props = {
  forms: ZetkinJoinForm[];
  onItemClick: (form: ZetkinJoinForm) => void;
};

const JoinFormList: FC<Props> = ({ forms, onItemClick }) => {
  return (
    <Box m={2}>
      <Card>
        {forms.map((form, index) => (
          <Box key={form.id}>
            {index > 0 && <Divider />}
            <JoinFormListItem form={form} onClick={() => onItemClick(form)} />
          </Box>
        ))}
      </Card>
    </Box>
  );
};

export default JoinFormList;
