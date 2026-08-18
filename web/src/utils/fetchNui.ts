export async function fetchNui<T = unknown>(event: string, data: unknown = {}): Promise<T> {
  const injectedFetch = (window as any).fetchNui;
  if (injectedFetch) return injectedFetch<T>(event, data);

  const resourceName = (window as any).GetParentResourceName?.() ?? "slrn_groups";
  const response = await fetch(`https://${resourceName}/${event}`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`${event} failed with status ${response.status}`);
  return response.json() as Promise<T>;
}
