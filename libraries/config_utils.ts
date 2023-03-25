export function getEnvar<T>(key: string): T | undefined {
  return Deno.env.get(key) as T || undefined
}
