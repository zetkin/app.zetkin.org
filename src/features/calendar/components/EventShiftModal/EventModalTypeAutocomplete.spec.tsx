import { describe, expect, it, jest } from '@jest/globals';
import userEvent from '@testing-library/user-event';

import { render } from 'utils/testing';
import { ZetkinActivity } from 'utils/types/zetkin';
import EventModalTypeAutocomplete from './EventModalTypeAutocomplete';

const types: ZetkinActivity[] = [
  { id: 1, info_text: null, title: 'Flyering' },
  { id: 2, info_text: null, title: 'Canvassing' },
];

describe('EventModalTypeAutocomplete', () => {
  it('keeps the search text when re-rendered while no type is selected', async () => {
    const props = {
      onChange: jest.fn(),
      onChangeNewOption: jest.fn(),
      onCreateType: jest.fn(),
      types,
      value: null,
    };

    const { getByRole, queryByDisplayValue, rerender } = render(
      <EventModalTypeAutocomplete {...props} />
    );

    const input = getByRole('combobox');
    await userEvent.clear(input);
    await userEvent.type(input, 'fly');
    expect(queryByDisplayValue('fly')).not.toBeNull();

    // The calendar week view re-renders every second to update its clock
    rerender(<EventModalTypeAutocomplete {...props} />);

    expect(queryByDisplayValue('fly')).not.toBeNull();
  });
});
