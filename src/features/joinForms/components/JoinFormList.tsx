import { FC, useState } from 'react';
import { Box, Card, Divider } from '@mui/material';

import JoinFormListItem from './JoinFormListItem';
import { ZetkinJoinForm } from '../types';

type Props = {
  forms: ZetkinJoinForm[];
  onItemClick: (form: ZetkinJoinForm) => void;
};

const JoinFormList: FC<Props> = ({ forms, onItemClick }) => {
  const [deleted, setDeleted] = useState<number[]>([]);
  return (
    <Box m={2}>
      <Card>
        {forms
          .filter((form) => !deleted.includes(form.id))
          .map((form, index) => (
            <Box key={form.id}>
              {index > 0 && <Divider />}
              <JoinFormListItem
                form={form}
                onClick={() => onItemClick(form)}
                onDeleted={() => setDeleted((prev) => [...prev, form.id])}
              />
            </Box>
          ))}
      </Card>
    </Box>
  );
};

export default JoinFormList;
