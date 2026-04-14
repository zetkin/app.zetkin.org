import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useServerSide from 'core/useServerSide';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useOfficialFieldMutations from '../hooks/useOfficialFieldMutations';

type FieldsListProps = {
  orgId: number;
};

const FieldsList: FC<FieldsListProps> = ({ orgId }) => {
  const onServer = useServerSide();
  const customFields = useCustomFields(orgId).data ?? [];
  const { removeField } = useOfficialFieldMutations(orgId);

  if (onServer) {
    return null;
  }

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={1}>
        {Object.entries(NATIVE_PERSON_FIELDS).map(([key, value]) => (
          <Box key={key} display="flex" gap={1}>
            <Box>{key}</Box>
            <Box>{value}</Box>
          </Box>
        ))}
      </Box>
      <Box display="flex" flexDirection="column" gap={1} mt={2}>
        {customFields.map((field) => (
          <Box key={field.slug} display="flex" gap={1}>
            <Typography>{field.title}</Typography>
            <Button onClick={() => removeField(field.id)}>remove</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FieldsList;
