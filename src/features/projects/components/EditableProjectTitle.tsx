import { Box } from '@mui/material';
import { FC } from 'react';

import { ZetkinProject } from 'utils/types/zetkin';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import useProject from '../hooks/useProject';
import { useNumericRouteParams } from 'core/hooks';

interface EditableProjectTitleProps {
  project: ZetkinProject;
}

const EditableProjectTitle: FC<EditableProjectTitleProps> = ({ project }) => {
  const { orgId } = useNumericRouteParams();
  const { updateProject } = useProject(orgId, project.id);

  return (
    <Box>
      <ZUIEditTextinPlace
        key={project.id}
        onChange={(newTitle) => {
          updateProject({ title: newTitle });
        }}
        value={project.title}
      />
    </Box>
  );
};

export default EditableProjectTitle;
