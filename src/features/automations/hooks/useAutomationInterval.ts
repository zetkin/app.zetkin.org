import { useEffect, useState } from 'react';

export type UseAutomationIntervalUnit = 'minutes' | 'hours' | 'days';

type UseAutomationIntervalReturn = {
  seconds: number;
  setUnit: (newUnit: UseAutomationIntervalUnit) => void;
  setValue: (newValue: number) => void;
  unit: UseAutomationIntervalUnit;
  unitOptions: UseAutomationIntervalUnit[];
  value: number;
};

const MULTIPLIERS = {
  days: 60 * 60 * 24,
  hours: 60 * 60,
  minutes: 60,
} as const;

export default function useAutomationInterval(
  initialSeconds: number
): UseAutomationIntervalReturn {
  const [unit, setUnit] = useState<UseAutomationIntervalUnit>('minutes');
  const [value, setValue] = useState(initialSeconds / 60);

  useEffect(() => {
    const units: UseAutomationIntervalUnit[] = ['days', 'hours', 'minutes'];
    for (const candidateUnit of units) {
      const valueForUnit = initialSeconds / MULTIPLIERS[candidateUnit];
      const roundedValue = Math.round(valueForUnit);
      const valueForUnitIsInt = valueForUnit == roundedValue;

      if (valueForUnitIsInt) {
        setUnit(candidateUnit);
        setValue(valueForUnit);
        break;
      }
    }
  }, [initialSeconds]);

  const seconds = value * MULTIPLIERS[unit];

  return {
    seconds,
    setUnit,
    setValue,
    unit,
    unitOptions: ['minutes', 'hours', 'days'],
    value,
  };
}
