import { FC } from 'react';
import useAssignmentAreaStats from 'features/areaAssignments/hooks/useAssignmentAreaStats';
import useAssignmentAreaGraph from 'features/areaAssignments/hooks/useAssignmentAreaGraph';
import AreaCard from 'features/areaAssignments/components/AreaCard';
import { ZetkinAssignmentAreaStatsItem } from 'features/areaAssignments/types';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinAreaAssignment } from '../types';

type AreaStatsCardProps = {
  orgId: number;
  areaAssId: number;
  assignment: ZetkinAreaAssignment;
};

const AreaStatsCard: FC<AreaStatsCardProps> = ({
  orgId,
  areaAssId,
  assignment,
}) => {
  const areasStats = useAssignmentAreaStats(orgId, areaAssId);
  const dataGraph = useAssignmentAreaGraph(orgId, areaAssId);
  return (
    <ZUIFutures futures={{ areasStats, dataGraph }}>
      {({ data: { areasStats, dataGraph } }) => {
        const filteredAreas = dataGraph
          .map((area) => {
            return areasStats.stats.filter(
              (item) => item.area_id === area.area_id
            );
          })
          .flat();

        const sortedAreas = filteredAreas
          .map((area) => {
            const successfulVisitsTotal =
              dataGraph
                .find((graph) => graph.area_id === area.area_id)
                ?.data.reduce((sum, item) => sum + item.successfulVisits, 0) ||
              0;

            return {
              area,
              successfulVisitsTotal,
            };
          })
          .sort((a, b) => b.successfulVisitsTotal - a.successfulVisitsTotal)
          .map(({ area }) => area);

        const maxHouseholdVisits = Math.max(
          ...dataGraph.flatMap((areaCard) =>
            areaCard.data.map((graphData) => graphData.householdVisits)
          )
        );

        const noAreaData = dataGraph.find((graph) => !graph.area_id);
        if (noAreaData && noAreaData.data.length > 0) {
          const latestEntry = [...noAreaData.data].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

          const num_successful_visited_households =
            latestEntry.successfulVisits;

          const num_visited_households = latestEntry.householdVisits;

          const noArea: ZetkinAssignmentAreaStatsItem = {
            area_id: null,
            num_households: 0,
            num_locations: 0,
            num_successful_visited_households,
            num_visited_households,
            num_visited_locations: 0,
          };
          sortedAreas.push(noArea);
        }
        return (
          <AreaCard
            areas={sortedAreas}
            assignment={assignment}
            data={dataGraph}
            maxVisitedHouseholds={maxHouseholdVisits}
          />
        );
      }}
    </ZUIFutures>
  );
};
export default AreaStatsCard;
