import { Box } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import { useState } from 'react';

import ZetkinPerson from 'components/ZetkinPerson';
import { ZetkinPerson as ZetkinPersonType } from 'types/zetkin';

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
      <ZetkinPerson
        id={person.id}
        name={`${person.first_name} ${person.last_name}`}
      />
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
