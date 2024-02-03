import JourneyInstancesDataTable from './index';
import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import { render } from 'utils/testing';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';

const journeyInstances = [mockJourneyInstance({ assignees: [], subjects: [] })];

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('JourneyInstancesDataTable.tsx', () => {
  it('Renders with no data', async () => {
    const { getByText } = render(
      <JourneyInstancesDataTable
        journeyInstances={[] as ZetkinJourneyInstance[]}
        tagColumnsData={[]}
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
          journeyInstances={journeyInstances}
          tagColumnsData={[]}
        />
      </div>
    );

    const milestone = await getByText('Attend a branch meeting.');
    expect(milestone).toBeTruthy();
  });
});
