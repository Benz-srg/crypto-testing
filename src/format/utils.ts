export function formatCryptoName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '');
}
