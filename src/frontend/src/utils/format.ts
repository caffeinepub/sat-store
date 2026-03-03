/**
 * Format cents to a dollar string: e.g. 1999 → "$19.99"
 */
export function formatPrice(priceCents: bigint | number): string {
  const cents =
    typeof priceCents === "bigint" ? Number(priceCents) : priceCents;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Returns a product image URL. Falls back to placehold.co if imageUrl is empty.
 */
export function getProductImage(
  imageUrl: string,
  name: string,
  size = 300,
): string {
  if (imageUrl && imageUrl.trim() !== "") return imageUrl;
  const encoded = encodeURIComponent(name.substring(0, 20));
  return `https://placehold.co/${size}x${size}/1a2040/f0a030?text=${encoded}`;
}

/**
 * Format a BigInt timestamp (nanoseconds from epoch) to a readable date.
 */
export function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

/**
 * Clamp a number to [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
