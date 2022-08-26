import JourneyInstanceOutcome from './JourneyInstanceOutcome';
import mockJourneyInstance from 'utils/testing/mocks/mockJourneyInstance';
import { render } from 'utils/testing';

describe('<JourneyInstanceOutcome/>', () => {
  it('shows the correct journeyTitle in title.', () => {
    const journeyInstance = mockJourneyInstance();

    const { getByText } = render(
      <JourneyInstanceOutcome journeyInstance={journeyInstance} />
    );

    const titleEl = getByText('pages.organizeJourneyInstance.sections.outcome');

    expect(titleEl).not.toBe(null);
  });

  it('shows the outcome note if provided by user.', () => {
    const journeyInstance = mockJourneyInstance({
      outcome: 'This case went super well!',
    });

    const { getByText } = render(
      <JourneyInstanceOutcome journeyInstance={journeyInstance} />
    );

    const outcomeNote = getByText('This case went super well!');

    expect(outcomeNote).not.toBe(null);
  });

  it('shows default outcome note if no note is provided by user.', () => {
    const journeyInstance = mockJourneyInstance();

    const { getByText } = render(
      <JourneyInstanceOutcome journeyInstance={journeyInstance} />
    );

    const defaultOutcomeNote = getByText(
      'pages.organizeJourneyInstance.noOutcomeDetails'
    );

    expect(defaultOutcomeNote).not.toBe(null);
  });
});
