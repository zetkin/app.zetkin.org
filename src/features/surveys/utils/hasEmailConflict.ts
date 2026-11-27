export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? '').trim().toLowerCase();
}

export default function hasEmailConflict(
  respondentEmail: string | null | undefined,
  personEmail: string | null | undefined
): boolean {
  const normalizedRespondentEmail = normalizeEmail(respondentEmail);
  if (!normalizedRespondentEmail) {
    return false;
  }

  const normalizedPersonEmail = normalizeEmail(personEmail);
  if (!normalizedPersonEmail) {
    return true;
  }

  return normalizedPersonEmail !== normalizedRespondentEmail;
}
