export function getOrigins(): string[] {
  return process.env.ORIGINS
    ? process.env.ORIGINS
      .split(',')
      .map((origin: string) => origin.trim())
    : [];
}
