import { FC } from 'react';
import {
  Box,
  Button,
  Divider,
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

interface MergeCandidateListProps {
  buttonLabel: string;
  onButtonClick: (person: ZetkinPerson) => void;
  rows: ZetkinPerson[];
}

const MergeCandidateList: FC<MergeCandidateListProps> = ({
  buttonLabel,
  onButtonClick,
  rows,
}) => {
  const { orgId } = useNumericRouteParams();

  return (
    <List>
      {rows.map((person, index) => {
        return (
          <>
            {index > 0 && <Divider />}
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <ListItem>
                <ListItemAvatar>
                  <ZUIPersonHoverCard personId={person.id}>
                    <ZUIAvatar
                      size={'md'}
                      url={`/api/orgs/${orgId}/people/${person.id}/avatar`}
                    />
                  </ZUIPersonHoverCard>
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
              <Button
                onClick={() => {
                  onButtonClick(person);
                }}
                size="small"
                sx={{ marginRight: 2 }}
                variant="outlined"
              >
                {buttonLabel}
              </Button>
            </Box>
          </>
        );
      })}
    </List>
  );
};

export default MergeCandidateList;
