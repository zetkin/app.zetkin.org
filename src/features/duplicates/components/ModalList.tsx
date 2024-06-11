import { FC } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';

import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

interface ModalListProps {
  buttonLabel: string;
  onButtonClick: (person: ZetkinPerson) => void;
  rows: ZetkinPerson[];
}

const ModalList: FC<ModalListProps> = ({
  buttonLabel,
  onButtonClick,
  rows,
}) => {
  const { orgId } = useNumericRouteParams();

  return (
    <List>
      {rows.map((person) => {
        return (
          <>
            <Divider />
            <ZUIPersonHoverCard personId={person.id}>
              <ListItem
                secondaryAction={
                  <FormControl
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      onClick={() => {
                        onButtonClick(person);
                      }}
                      size="small"
                      variant="outlined"
                    >
                      {buttonLabel}
                    </Button>
                  </FormControl>
                }
              >
                <ListItemAvatar>
                  <ZUIAvatar
                    size={'md'}
                    url={`/api/orgs/${orgId}/people/${person.id}/avatar`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box>
                      <Typography
                        sx={{
                          display: 'inline-block',
                          textOverflow: 'ellipsis',
                        }}
                        variant="h5"
                      >
                        {person.first_name + ' ' + person.last_name}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        gutterBottom
                        sx={{ display: 'inline', textOverflow: 'ellipsis' }}
                        variant="body2"
                      >
                        {person.email || ''}
                      </Typography>{' '}
                      <Typography
                        gutterBottom
                        sx={{ display: 'inline', textOverflow: 'ellipsis' }}
                        variant="body2"
                      >
                        {person.phone || ''}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </ZUIPersonHoverCard>
          </>
        );
      })}
    </List>
  );
};

export default ModalList;
