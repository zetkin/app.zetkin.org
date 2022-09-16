import { render } from 'utils/testing';
import singletonRouter from 'next/router';

import JourneyMilestoneCard from './JourneyMilestoneCard';
import mockMilestone from 'utils/testing/mocks/mockMilestone';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('<JourneyMilestoneCard />', () => {
  beforeEach(() => {
    singletonRouter.query = {
      instanceId: '1',
      orgId: '1',
    };
  });

  it('has a title.', () => {
    const milestone = mockMilestone();
    const { getByText } = render(
      <JourneyMilestoneCard milestone={milestone} />
    );

    const milestonEl = getByText(milestone.title);
    expect(milestonEl.textContent).toBe(milestone.title);
  });

  it('has a description', () => {
    const milestone = mockMilestone();
    const { getByText } = render(
      <JourneyMilestoneCard milestone={milestone} />
    );

    const milestonEl = getByText(milestone.description);

    expect(milestonEl.textContent).toBe(milestone.description);
  });

  it('has an unchecked checkbox if milestone is not completed.', () => {
    const milestone = mockMilestone();
    const { getByTestId } = render(
      <JourneyMilestoneCard milestone={milestone} />
    );

    const classList = getByTestId('JourneyMilestoneCard-completed').classList;

    expect(classList).not.toContain('Mui-checked');
  });

  it('has a checked checkbox if milestone is completed.', () => {
    const milestone = mockMilestone({ completed: '2022-03-18T15:29:12+02:00' });
    const { getByTestId } = render(
      <JourneyMilestoneCard milestone={milestone} />
    );

    const classList = getByTestId('JourneyMilestoneCard-completed').classList;

    expect(classList).toContain('Mui-checked');
  });

  it('has an empty datepicker if deadline is not set.', () => {
    const milestone = mockMilestone({ deadline: null });
    const { getByTestId } = render(
      <JourneyMilestoneCard milestone={milestone} />
    );

    const label = getByTestId('JourneyMilestoneCard-datePicker').querySelector(
      'label'
    );

    const input = getByTestId('JourneyMilestoneCard-datePicker').querySelector(
      'input'
    );

    expect(label?.textContent).toBe(
      'pages.organizeJourneyInstance.dueDateInputLabel'
    );
    expect(input?.value).toBe('');
  });
});
