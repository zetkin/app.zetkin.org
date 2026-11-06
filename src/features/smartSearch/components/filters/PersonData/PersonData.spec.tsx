import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, screen, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ReactElement } from 'react';

import { render } from 'utils/testing';
import PersonData from '.';
import DisplayPersonData from './DisplayPersonData';
import {
  FILTER_TYPE,
  OPERATION,
  PersonDataFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

jest.mock('core/hooks/useNumericRouteParams', () => () => ({ orgId: 1 }));
jest.mock('features/organizations/hooks/useSubOrganizations', () => () => ({
  data: [],
}));
jest.mock('zui/ZUIOrgScopeSelect', () => () => null);

// In test mode messages render as their IDs, which drops interpolated
// values (and with them the selects inside the sentence). Provide the
// English strings this filter needs instead.
const P = 'feat.smartSearch.filters.personData';
const MESSAGES: Record<string, string> = {
  'feat.smartSearch.operators.add': 'Add',
  'feat.smartSearch.operators.limit': 'Limit to',
  'feat.smartSearch.operators.sub': 'Remove',
  [`${P}.ellipsis`]: '...',
  [`${P}.fieldCondition`]: '{field} {operator} {value}',
  [`${P}.fieldIsSet`]: '{field} is set',
  [`${P}.fieldMatches`]: '{field} matches {value}',
  [`${P}.fieldSelect.alt_phone`]: 'alternative phone number',
  [`${P}.fieldSelect.city`]: 'city',
  [`${P}.fieldSelect.co_address`]: 'co-address',
  [`${P}.fieldSelect.email`]: 'email',
  [`${P}.fieldSelect.first_name`]: 'first name',
  [`${P}.fieldSelect.gender`]: 'gender',
  [`${P}.fieldSelect.last_name`]: 'last name',
  [`${P}.fieldSelect.phone`]: 'phone number',
  [`${P}.fieldSelect.remove`]: 'Remove this criteria',
  [`${P}.fieldSelect.street_address`]: 'street address',
  [`${P}.fieldSelect.zip_code`]: 'zip code',
  [`${P}.fieldTuple`]: '{first} and {second}',
  [`${P}.genders.f`]: 'female',
  [`${P}.genders.m`]: 'male',
  [`${P}.genders.o`]: 'other',
  [`${P}.genders.unknown`]: 'unknown',
  [`${P}.inputString`]: '{addRemoveSelect} any person whose {criteria}.',
  [`${P}.operatorSelect.is_set`]: 'is set',
  [`${P}.operatorSelect.matches`]: 'matches',
};

function renderWithMessages(ui: ReactElement) {
  return render(
    <IntlProvider locale="en" messages={MESSAGES}>
      {ui}
    </IntlProvider>
  );
}

function makeFilter(
  fields: PersonDataFilterConfig['fields'],
  op: OPERATION = OPERATION.ADD
): SmartSearchFilterWithId<PersonDataFilterConfig> {
  return { config: { fields }, id: 1, op, type: FILTER_TYPE.PERSON_DATA };
}

function selectOption(testId: string, optionName: string) {
  const select = within(screen.getByTestId(testId)).getByRole('combobox');
  fireEvent.mouseDown(select);
  fireEvent.click(screen.getByRole('option', { name: optionName }));
}

function saveButton() {
  return screen.getByTestId('FilterForm-saveButton');
}

describe('<PersonData />', () => {
  it('starts with "first name matches" and can not be saved empty', () => {
    renderWithMessages(
      <PersonData
        filter={{ type: FILTER_TYPE.PERSON_DATA }}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    const operator = screen.getByTestId('PersonData-operatorSelect-first_name');
    expect(within(operator).getByRole('combobox').textContent).toBe('matches');
    expect(screen.getByTestId('PersonData-valueInput-first_name')).toBeTruthy();
    expect(saveButton()).toHaveProperty('disabled', true);
  });

  it('saves "is set" as an empty string without entering a value', () => {
    const onSubmit = jest.fn();
    renderWithMessages(
      <PersonData
        filter={{ type: FILTER_TYPE.PERSON_DATA }}
        onCancel={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    selectOption('PersonData-fieldSelect-first_name', 'phone number');
    selectOption('PersonData-operatorSelect-phone', 'is set');

    expect(screen.queryByTestId('PersonData-valueInput-phone')).toBeNull();
    expect(saveButton()).toHaveProperty('disabled', false);

    fireEvent.click(saveButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ fields: { phone: '' } }),
        op: OPERATION.ADD,
        type: FILTER_TYPE.PERSON_DATA,
      })
    );
  });

  it('loads a saved empty value as "is set" and keeps the operation', () => {
    const onSubmit = jest.fn();
    renderWithMessages(
      <PersonData
        filter={makeFilter({ phone: '' }, OPERATION.SUB)}
        onCancel={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    const operator = screen.getByTestId('PersonData-operatorSelect-phone');
    expect(within(operator).getByRole('combobox').textContent).toBe('is set');
    expect(screen.queryByTestId('PersonData-valueInput-phone')).toBeNull();

    fireEvent.click(saveButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ fields: { phone: '' } }),
        id: 1,
        op: OPERATION.SUB,
      })
    );
  });

  it('switching back to "matches" requires a value again', () => {
    renderWithMessages(
      <PersonData
        filter={makeFilter({ email: '' })}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    selectOption('PersonData-operatorSelect-email', 'matches');

    expect(screen.getByTestId('PersonData-valueInput-email')).toBeTruthy();
    expect(saveButton()).toHaveProperty('disabled', true);
  });

  it('loads a saved non-empty value as "matches"', () => {
    renderWithMessages(
      <PersonData
        filter={makeFilter({ city: 'Stockholm' })}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    const operator = screen.getByTestId('PersonData-operatorSelect-city');
    expect(within(operator).getByRole('combobox').textContent).toBe('matches');
    const input = within(
      screen.getByTestId('PersonData-valueInput-city')
    ).getByRole('textbox');
    expect(input).toHaveProperty('value', 'Stockholm');
  });

  it('does not offer "is set" for gender', () => {
    renderWithMessages(
      <PersonData
        filter={makeFilter({ gender: 'f' })}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.queryByTestId('PersonData-operatorSelect-gender')).toBeNull();
    expect(saveButton()).toHaveProperty('disabled', false);
  });

  it('falls back to "matches" when an "is set" field is changed to gender', () => {
    renderWithMessages(
      <PersonData
        filter={makeFilter({ phone: '' })}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    selectOption('PersonData-fieldSelect-phone', 'gender');

    expect(screen.queryByTestId('PersonData-operatorSelect-gender')).toBeNull();
    expect(saveButton()).toHaveProperty('disabled', false);
  });
});

describe('<DisplayPersonData />', () => {
  it('describes an empty value as "is set"', () => {
    const { container } = renderWithMessages(
      <DisplayPersonData filter={makeFilter({ phone: '' })} />
    );
    expect(container.textContent).toBe(
      'Add any person whose phone number is set.'
    );
  });

  it('describes a non-empty value as "matches"', () => {
    const { container } = renderWithMessages(
      <DisplayPersonData
        filter={makeFilter({ city: 'Stockholm' }, OPERATION.SUB)}
      />
    );
    expect(container.textContent).toBe(
      'Remove any person whose city matches Stockholm.'
    );
  });

  it('combines "is set" and "matches" criteria', () => {
    const { container } = renderWithMessages(
      <DisplayPersonData
        filter={makeFilter({ city: 'Stockholm', email: '' }, OPERATION.LIMIT)}
      />
    );
    expect(container.textContent).toContain('email is set');
    expect(container.textContent).toContain('city matches Stockholm');
  });

  it('shows gender by its label', () => {
    const { container } = renderWithMessages(
      <DisplayPersonData filter={makeFilter({ gender: 'm' })} />
    );
    expect(container.textContent).toBe(
      'Add any person whose gender matches male.'
    );
  });
});
