export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidTarget(value: string): boolean {
  // Accepts an IPv4 address, a CIDR range, or a bare hostname.
  const ipOrCidr = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  const hostname = /^[a-zA-Z0-9.-]+$/;
  return ipOrCidr.test(value) || hostname.test(value);
}
