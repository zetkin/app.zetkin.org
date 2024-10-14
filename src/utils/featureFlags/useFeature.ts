import { useNumericRouteParams } from 'core/hooks';
import useEnv from '../../core/hooks/useEnv';
import hasFeature from './hasFeature';

export default function useFeature(
  featureLabel: string,
  orgId?: number
): boolean {
  const env = useEnv();

  const { orgId: orgIdFromRoute } = useNumericRouteParams();

  const untypedVars = env.vars as Record<string, string | undefined>;
  return hasFeature(featureLabel, orgId || orgIdFromRoute, untypedVars);
}
