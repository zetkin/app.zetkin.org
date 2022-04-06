import JourneyInstancesDataTable from './index';
import mockPerson from 'utils/testing/mocks/mockPerson';
import { render } from 'utils/testing';
import { ZetkinJourneyInstance } from 'types/zetkin';

const columnNames = {
  created_at: 'Created',
  id: 'Title',
  next_milestone_deadline: 'Next milestone deadline',
  next_milestone_title: 'Next milestone',
  summary: 'Summary',
  tagsFree: 'Tags',
  updated_at: 'Last updated',
};

const tagMetadata = { groups: [], valueTags: [] };

const journey = {
  id: 2,
  organization: {
    id: 1,
    title: 'Kommunistiche Partei Deutschlands',
  },
  plural_name: 'Marxist trainings',
  singular_name: 'Marxist training',
  stats: {
    closed: 359,
    open: 75,
  },
};

const journeyInstances = [
  {
    assigned_to: [mockPerson()],
    created_at: '2022-04-01T03:29:12+02:00',
    id: 333,
    next_milestone: {
      deadline: '2022-04-18T00:29:12+02:00',
      title: 'perform lip sync',
    },
    people: [mockPerson()],
    summary: 'Haohrez uhca evo fup fonruh do vafeesa lida penco rillesven.',
    tags: [],
    title: 'Training ID 1',
    updated_at: '2022-04-03T23:59:12+02:00',
  },
];

describe('JourneyInstancesDataTable.tsx', () => {
  it('Renders with no data', async () => {
    const { getByText } = render(
      <JourneyInstancesDataTable
        columnNames={columnNames}
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
    const { getByText, getAllByRole } = render(
      <div
        style={{
          height: 2000,
          width: 2000,
        }}
      >
        <JourneyInstancesDataTable
          columnNames={columnNames}
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

    const colHeaders = await getAllByRole('columnheader');
    expect(colHeaders.length).toEqual(Object.keys(columnNames).length);
    const milestone = await getByText('perform lip sync');
    expect(milestone).toBeTruthy();
  });
});
