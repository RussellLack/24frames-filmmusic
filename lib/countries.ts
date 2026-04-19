// Mirror of schemaTypes/countries.ts in the Sanity Studio.
// Keep in sync if either list changes.
export const COUNTRIES: { title: string; value: string }[] = [
  { title: 'United States', value: 'us' },
  { title: 'United Kingdom', value: 'gb' },
  { title: 'France', value: 'fr' },
  { title: 'Germany', value: 'de' },
  { title: 'Italy', value: 'it' },
  { title: 'Spain', value: 'es' },
  { title: 'Portugal', value: 'pt' },
  { title: 'Netherlands', value: 'nl' },
  { title: 'Belgium', value: 'be' },
  { title: 'Ireland', value: 'ie' },
  { title: 'Austria', value: 'at' },
  { title: 'Switzerland', value: 'ch' },
  { title: 'Sweden', value: 'se' },
  { title: 'Denmark', value: 'dk' },
  { title: 'Norway', value: 'no' },
  { title: 'Finland', value: 'fi' },
  { title: 'Poland', value: 'pl' },
  { title: 'Czech Republic', value: 'cz' },
  { title: 'Greece', value: 'gr' },
  { title: 'Turkey', value: 'tr' },
  { title: 'Russia', value: 'ru' },
  { title: 'Japan', value: 'jp' },
  { title: 'South Korea', value: 'kr' },
  { title: 'China', value: 'cn' },
  { title: 'Hong Kong', value: 'hk' },
  { title: 'India', value: 'in' },
  { title: 'Iran', value: 'ir' },
  { title: 'Israel', value: 'il' },
  { title: 'Australia', value: 'au' },
  { title: 'Canada', value: 'ca' },
  { title: 'Mexico', value: 'mx' },
  { title: 'Brazil', value: 'br' },
  { title: 'Argentina', value: 'ar' },
  { title: 'Other', value: 'other' },
]

const countryByValue: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.value, c.title]),
)

export function countryLabel(code: string): string {
  return countryByValue[code] ?? code.toUpperCase()
}
