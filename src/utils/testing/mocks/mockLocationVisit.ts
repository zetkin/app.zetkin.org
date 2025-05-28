import { ZetkinLocationVisit } from 'features/canvass/types';

export default function mockLocationVisit(
  overrides?: Partial<ZetkinLocationVisit>
): ZetkinLocationVisit {
  const defaultValues: ZetkinLocationVisit = {
    assignment_id: 1,
    created: new Date().toISOString(),
    created_by_user_id: 1,
    id: 1,
    location_id: 1,
    metrics: [],
    num_households_visited: 1,
  };

  return {
    ...defaultValues,
    ...overrides,
  };
}
