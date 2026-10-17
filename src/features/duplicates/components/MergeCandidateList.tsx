import { FC } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { VerticalAlignCenter, EmojiEvents } from '@mui/icons-material';

import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

interface MergeCandidateListProps {
  buttonLabel: string;
  onButtonClick: (person: ZetkinPerson) => void;
  onTargetClick?: (person: ZetkinPerson) => void;
  rows: ZetkinPerson[];
  showActionButton?: boolean;
}

const MergeCandidateList: FC<MergeCandidateListProps> = ({
  buttonLabel,
  onButtonClick,
  onTargetClick,
  rows,
  showActionButton = true,
}) => {
  const { orgId } = useNumericRouteParams();

  return (
    <List>
      {rows.map((person, index) => {
        return (
          <>
            {index > 0 && <Divider />}
            <ListItem>
              <Box
                alignItems="center"
                display="flex"
                flex="1 0 auto"
                justifyContent="space-between"
              >
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
                    <Box display="flex" gap={1}>
                      <Typography
                        sx={{
                          display: 'inline-block',
                          textOverflow: 'ellipsis',
                        }}
                        variant="h5"
                      >
                        {person.first_name + ' ' + person.last_name}
                      </Typography>
                      <Typography
                        sx={{
                          display: 'inline-block',
                          textOverflow: 'ellipsis',
                        }}
                        variant="labelSmMedium"
                      >
                        {person.is_user && 'Zetkin user'}
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
                <Box>
                  <ButtonGroup variant="outlined">
                    {onTargetClick && (
                      <Button
                        disabled={index === 0}
                        onClick={() => {
                          onTargetClick(person);
                        }}
                      >
                        {index === 0 ? (
                          <EmojiEvents />
                        ) : (
                          <VerticalAlignCenter />
                        )}
                      </Button>
                    )}
                    {showActionButton && (
                      <Button
                        onClick={() => {
                          onButtonClick(person);
                        }}
                      >
                        {buttonLabel}
                      </Button>
                    )}
                  </ButtonGroup>
                </Box>
              </Box>
            </ListItem>
          </>
        );
      })}
    </List>
  );
};

export default MergeCandidateList;
