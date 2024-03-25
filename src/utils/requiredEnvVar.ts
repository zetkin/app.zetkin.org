export default function requiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error('Missing environment variable ' + name);
  }

  return value;
}
