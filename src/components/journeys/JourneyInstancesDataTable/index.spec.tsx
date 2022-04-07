import JourneyInstancesDataTable from './index';
import mockJourney from 'utils/testing/mocks/mockJourney';
import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import { render } from 'utils/testing';
import { ZetkinJourneyInstance } from 'types/zetkin';

const tagMetadata = { groups: [], valueTags: [] };
const journey = mockJourney();
const journeyInstances = [mockJourneyInstance({ assigned_to: [], people: [] })];

describe('JourneyInstancesDataTable.tsx', () => {
  it('Renders with no data', async () => {
    const { getByText } = render(
      <JourneyInstancesDataTable
        journey={journey}
        journeyInstances={[] as ZetkinJourneyInstance[]}
        tagMetadata={tagMetadata}
      />
    );

    // Columns visible
    const noRows = await getByText('No rows');
    expect(noRows).toBeTruthy();
  });

  it('Renders column headers & data correctly', async () => {
    const { getByText } = render(
      <div
        style={{
          height: 2000,
          width: 2000,
        }}
      >
        <JourneyInstancesDataTable
          dataGridProps={{
            checkboxSelection: false,
            disableVirtualization: true,
          }}
          journey={journey}
          journeyInstances={journeyInstances}
          tagMetadata={tagMetadata}
        />
      </div>
    );

    const milestone = await getByText('perform lip sync');
    expect(milestone).toBeTruthy();
  });
});
