export default function hasFeature(
  featureLabel: string,
  orgId: number,
  envVars: Record<string, string | undefined>
): boolean {
  const envValue = envVars['FEAT_' + featureLabel];

  const settings = envValue?.split(',') || [];

  return settings.some((setting) => {
    return setting == '*' || setting == orgId.toString();
  });
}
