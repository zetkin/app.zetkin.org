import { FC } from 'react';
import { Box } from '@mui/material';

import EventCard from './EventCard';
import useUpcomingEvents from '../hooks/useUpcomingEvents';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
import ZUISection from 'zui/components/ZUISection';
import { ZetkinCallTarget } from '../types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import SurveyCard from './SurveyCard';

type ActivitiesSectionProps = {
  assignment: ZetkinCallAssignment;
  target: ZetkinCallTarget | null;
};

const ActivitiesSection: FC<ActivitiesSectionProps> = ({
  assignment,
  target,
}) => {
  const events = useUpcomingEvents(assignment.organization.id);
  const surveys = useSurveysWithElements(assignment.organization.id).data || [];
  const today = new Date();

  const activeSurveys = surveys.filter(
    ({ published, expires }) =>
      published && (!expires || new Date(expires) >= today)
  );

  return (
    <ZUISection
      borders={false}
      fullHeight
      renderContent={() => {
        if (!target) {
          return <Box sx={{ height: '200px' }} />;
        }
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {events.map((event, index) => (
              <EventCard key={index} event={event} target={target} />
            ))}
            {activeSurveys.map((survey, index) => (
              <SurveyCard key={index} survey={survey} />
            ))}
          </Box>
        );
      }}
      subtitle={`Acting as ${target?.first_name}`}
      title="Activities"
    />
  );
};

export default ActivitiesSection;
