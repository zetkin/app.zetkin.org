import { ZetkinAreaAssignment } from 'features/areaAssignments/types';

export default function mockAreaAssignment(
  overrides?: Partial<ZetkinAreaAssignment>
): ZetkinAreaAssignment {
  const now = new Date();

  const nextMonth = new Date(now);
  nextMonth.setDate(now.getMonth() + 1);

  const defaultValues: ZetkinAreaAssignment = {
    end_date: nextMonth.toISOString(),
    id: 1,
    instructions: '',
    organization_id: 1,
    project_id: 1,
    reporting_level: 'household',
    start_date: now.toISOString(),
    title: '',
  };

  return {
    ...defaultValues,
    ...overrides,
  };
}
