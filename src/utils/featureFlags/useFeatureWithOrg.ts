import useEnv from '../../core/hooks/useEnv';
import hasFeature from './hasFeature';

export default function useFeatureWithOrg(
  featureLabel: string,
  orgId: number
): boolean {
  const env = useEnv();

  const untypedVars = env.vars as Record<string, string | undefined>;
  return hasFeature(featureLabel, orgId, untypedVars);
}
