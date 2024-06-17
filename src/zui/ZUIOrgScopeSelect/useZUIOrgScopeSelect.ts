import { useState } from 'react';

export type Scope = 'all' | 'specific' | 'suborgs' | 'this';

type ValueType = 'all' | 'suborgs' | number[];

type UseZUIOrgScopeSelectReturn = {
  orgs: number[];
  scope: Scope;
  setOrgs: (orgs: number[]) => void;
  setScope: (scope: Scope) => void;
};

type UseZUIOrgScopeSelectProps = {
  currentOrg: number;
  onChange?: (value: ValueType) => void;
  value: ValueType;
};

function getScopeFromValue(value: ValueType, currentOrg: number): Scope {
  if (Array.isArray(value)) {
    if (value.length == 1 && value[0] == currentOrg) {
      return 'this';
    } else {
      return 'specific';
    }
  } else {
    return value;
  }
}

export default function useZUIOrgScopeSelect({
  value,
  currentOrg,
  onChange,
}: UseZUIOrgScopeSelectProps): UseZUIOrgScopeSelectReturn {
  const initialScope = getScopeFromValue(value, currentOrg);
  const [scope, setScope] = useState(initialScope);
  const [orgs, setOrgs] = useState(Array.isArray(value) ? value : []);

  return {
    orgs,
    scope,
    setOrgs: (orgs: number[]) => {
      setOrgs(orgs);
      onChange?.(orgs);
    },
    setScope: (scope: Scope) => {
      setScope(scope);
      if (scope == 'this') {
        setOrgs([currentOrg]);
        onChange?.([currentOrg]);
      } else if (scope == 'suborgs') {
        onChange?.('suborgs');
      } else if (scope == 'all') {
        onChange?.('all');
      }
    },
  };
}
