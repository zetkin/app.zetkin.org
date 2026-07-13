import { ZetkinHouseholdVisit } from 'features/canvass/types';

export default function mockHouseholdVisit(
  overrides?: Partial<ZetkinHouseholdVisit>
): ZetkinHouseholdVisit {
  const defaultValues: ZetkinHouseholdVisit = {
    assignment_id: 11,
    created: new Date().toISOString(),
    created_by_user_id: 1,
    household_id: 1001,
    id: 2001,
    metrics: [
      {
        metric_id: 10001,
        response: 'yes',
      },
    ],
  };

  return {
    ...defaultValues,
    ...overrides,
  };
}
