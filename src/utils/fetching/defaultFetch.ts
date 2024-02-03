export default function defaultFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(`/api${path}`, init);
}
