'use client';

import { FC } from 'react';

import useMyCanvassAssignments from 'features/areas/hooks/useMyCanvassAssignments';

const ProfilePage: FC = () => {
  const myCanvassAssignments = useMyCanvassAssignments().data || [];

  return (
    <div>
      {myCanvassAssignments.map((assignment) => (
        <p key={assignment.id}>{`${assignment.id} ${assignment.areaUrl}`}</p>
      ))}
    </div>
  );
};

export default ProfilePage;
