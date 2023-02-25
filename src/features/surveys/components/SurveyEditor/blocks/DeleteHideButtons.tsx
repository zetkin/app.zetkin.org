import { FC } from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';

interface DeleteHideButtonsProps {
  hidden: boolean;
  onDelete: () => void;
  onToggleHidden: (hidden: boolean) => void;
}

const DeleteHideButtons: FC<DeleteHideButtonsProps> = ({
  hidden,
  onDelete,
  onToggleHidden,
}) => {
  return (
    <Box display="flex">
      <IconButton onClick={() => onToggleHidden(!hidden)}>
        <RemoveRedEye />
      </IconButton>
      <IconButton
        onClick={(evt) => {
          evt.stopPropagation();
          onDelete();
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default DeleteHideButtons;
