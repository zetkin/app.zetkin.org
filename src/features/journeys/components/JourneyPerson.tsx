import { Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';

import { ZetkinPerson as ZetkinPersonType } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

const JourneyPerson = ({
  person,
  onRemove,
}: {
  onRemove: (person: ZetkinPersonType) => void;
  person: ZetkinPersonType;
}): JSX.Element => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <Box
      alignItems="center"
      bgcolor={hover ? grey[200] : ''}
      data-testid={`JourneyPerson-${person.id}`}
      display="flex"
      justifyContent="space-between"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      p={1}
    >
      <ZUIPersonHoverCard personId={person.id}>
        <ZUIPerson
          id={person.id}
          name={`${person.first_name} ${person.last_name}`}
          tooltip={false}
        />
      </ZUIPersonHoverCard>
      {hover && (
        <Close
          color="secondary"
          data-testid={`JourneyPerson-remove-${person.id}`}
          onClick={() => onRemove(person)}
          style={{ cursor: 'pointer' }}
        />
      )}
    </Box>
  );
};

export default JourneyPerson;
